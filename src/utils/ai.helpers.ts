// deno-lint-ignore-file no-explicit-any
import { Runnable } from "npm:@langchain/core/runnables";
import { ServerSentEventMessage, ServerSentEventStream } from "../src.deps.ts";
import {
  BaseLanguageModel,
  BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  createRetrievalChain,
  createStuffDocumentsChain,
  VectorStore,
} from "../langchain.deps.ts";

export async function aiChatRequest(
  req: Request,
  llm: BaseLanguageModel,
  messages?: BaseMessagePromptTemplateLike[],
  useSSEFormat?: boolean,
  defaultInput?: any,
  vectorStore?: VectorStore,
  defaultRAGInput?: any,
): Promise<Response> {
  const questionAnsweringPrompt = ChatPromptTemplate.fromMessages(
    messages || [],
  );

  let chain: Runnable;

  let input = req.method.toLowerCase() === "post"
    ? await req.json()
    : undefined;

  if (vectorStore) {
    const combineDocsChain = await createStuffDocumentsChain({
      llm: llm,
      prompt: questionAnsweringPrompt,
    });

    chain = await createRetrievalChain({
      retriever: vectorStore.asRetriever(),
      combineDocsChain,
    });

    input ??= defaultRAGInput || {};
  } else {
    chain = questionAnsweringPrompt.pipe(llm);

    input ??= defaultInput || {};
  }

  // TODO(mcgear): Add support for chat history
  const stream = await chain.stream(input);

  const body = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.answer || chunk.content;

        if (content) {
          if (useSSEFormat) {
            controller.enqueue({
              id: Date.now(),
              event: "message",
              data: content,
            } as ServerSentEventMessage);
          } else {
            controller.enqueue(new TextEncoder().encode(`${content}`));
          }
        }
      }

      controller.close();
    },
    cancel() {
      // stream.cancel();
    },
  });

  const resp = new Response(
    useSSEFormat ? body.pipeThrough(new ServerSentEventStream()) : body,
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    },
  );

  return resp;
}
