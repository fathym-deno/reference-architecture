import { Runnable } from "npm:@langchain/core/runnables";
import {
  AzureAISearchQueryType,
  AzureAISearchVectorStore,
  AzureChatOpenAI,
  AzureOpenAIEmbeddings,
  BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  createRetrievalChain,
  createStuffDocumentsChain,
  DenoKVOAuth,
  OpenAIBaseInput,
  ServerSentEventMessage,
  ServerSentEventStream,
  STATUS_CODE,
} from "../src.deps.ts";

export async function aiRAGChatRequest(
  req: Request,
  endpoint: string,
  apiKey: string,
  deploymentName: string,
  modelName: string,
  messages: BaseMessagePromptTemplateLike[],
  useSSEFormat: boolean,
  inputParams?: Partial<OpenAIBaseInput>,
  embeddingDeploymentName?: string,
  searchEndpoint?: string,
  searchApiKey?: string,
): Promise<Response> {
  const model = new AzureChatOpenAI({
    azureOpenAIEndpoint: endpoint,
    azureOpenAIApiKey: apiKey,
    azureOpenAIEmbeddingsApiDeploymentName: deploymentName,
    modelName: modelName,
    temperature: 0.7,
    // maxTokens: 1000,
    maxRetries: 5,
    verbose: true,
    ...(inputParams || {}),
  });

  const questionAnsweringPrompt = ChatPromptTemplate.fromMessages(messages);

  let chain: Runnable;

  let input = await req.json();

  if (searchEndpoint) {
    const combineDocsChain = await createStuffDocumentsChain({
      llm: model,
      prompt: questionAnsweringPrompt,
    });

    const embeddings = new AzureOpenAIEmbeddings({
      azureOpenAIEndpoint: endpoint,
      azureOpenAIApiKey: apiKey,
      azureOpenAIEmbeddingsApiDeploymentName: embeddingDeploymentName,
    });

    const vectorStore = new AzureAISearchVectorStore(embeddings, {
      endpoint: searchEndpoint,
      key: searchApiKey,
      search: {
        type: AzureAISearchQueryType.SimilarityHybrid,
      },
    });

    chain = await createRetrievalChain({
      retriever: vectorStore.asRetriever(),
      combineDocsChain,
    });

    input ??= {
      input: "Tell me about Fathym Inc",
    };
  } else {
    chain = questionAnsweringPrompt.pipe(model);

    input ??= {
      input: "Tell me about Fathym Inc",
      context: "",
    };
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

export async function oAuthRequest(
  req: Request,
  clientId: string,
  clientSecret: string,
  authorizationEndpointUri: string,
  tokenUri: string,
  scope: string[],
  completeCallback: (
    tokens: DenoKVOAuth.Tokens,
    newSessionId: string,
    oldSessionId?: string,
  ) => Promise<void>,
  basePattern?: string,
): Promise<Response> {
  const pattern = new URLPattern({ pathname: basePattern || "/*" });

  const patternResult = pattern.exec(req.url);

  let oAuthPath = patternResult!.pathname.groups[0]!;

  if (!oAuthPath.startsWith("/")) {
    oAuthPath = `/${oAuthPath}`;
  }

  const oAuthConfig: DenoKVOAuth.OAuth2ClientConfig = {
    clientId,
    clientSecret,
    authorizationEndpointUri,
    tokenUri,
    defaults: { scope: scope },
  };

  const helpers = DenoKVOAuth.createHelpers(oAuthConfig);

  let resp: Response;

  switch (oAuthPath) {
    case "/signin": {
      const url = new URL(req.url);

      const host = req.headers.get("x-forwarded-host") || url.host;

      const proto = req.headers.get("x-forwarded-proto") || url.protocol;

      const callbackPath = patternResult!.pathname.input.replace(
        oAuthPath,
        "/callback",
      );

      resp = await helpers.signIn(req, {
        urlParams: {
          redirect_uri: `${proto}//${host}${callbackPath}`,
        },
      });

      break;
    }

    case "/callback": {
      const oldSessionId = await helpers.getSessionId(req);

      const { response, tokens, sessionId } = await helpers.handleCallback(req);

      completeCallback(tokens, sessionId, oldSessionId);

      resp = response;

      break;
    }

    case "/signout": {
      resp = await helpers.signOut(req);

      break;
    }

    default: {
      throw new Error(`The provided path '${oAuthPath}' is invalid.`);
    }
  }

  return resp;
}

export async function proxyRequest(
  req: Request,
  proxyRoot: string,
  basePattern?: string,
  // remoteAddr?: string,
): Promise<Response> {
  const originalUrl = new URL(req.url);

  const proxyUrl = new URL(proxyRoot);

  if (basePattern) {
    const pattern = new URLPattern({ pathname: basePattern });

    const patternResult = pattern.exec(req.url);

    proxyUrl.pathname += patternResult!.pathname.groups[0]!;
  }

  for (const queryParam of originalUrl.searchParams.keys()) {
    const queryValues = originalUrl.searchParams.getAll(queryParam);

    queryValues.forEach((qv, i) => {
      if (i === 0) {
        proxyUrl.searchParams.set(queryParam, qv || "");
      } else {
        proxyUrl.searchParams.append(queryParam, qv || "");
      }
    });
  }

  const proxyReq = new Request(proxyUrl, {
    ...req,
    headers: {
      ...req.headers,
      // 'x-forwarded-for': remoteAddr,
      "x-forwarded-host": originalUrl.host,
      "x-forwarded-proto": originalUrl.protocol,
    },
  });

  let resp = await fetch(proxyReq, {
    redirect: "manual",
  });

  const redirectLocation = resp.headers.get("location");

  if (redirectLocation) {
    resp = redirectRequest(redirectLocation, resp.status);
  }

  return resp;
}

export function redirectRequest(
  location: string,
  status: number,
  req?: Request,
): Response;

export function redirectRequest(
  location: string,
  preserve?: boolean,
  permanent?: boolean,
  req?: Request,
): Response;

export function redirectRequest(
  location: string,
  statusPreserve?: number | boolean,
  permanentReq?: Request | boolean,
  req?: Request,
): Response {
  let permanent: boolean | undefined;
  let status: number;

  if (typeof permanentReq === "object") {
    req = permanentReq;

    permanent = undefined;
  } else {
    permanent = permanentReq;
  }

  if (typeof statusPreserve === "number") {
    status = statusPreserve;
  } else {
    if (statusPreserve) {
      status = permanent
        ? STATUS_CODE.PermanentRedirect
        : STATUS_CODE.TemporaryRedirect;
    } else {
      status = permanent ? STATUS_CODE.MovedPermanently : STATUS_CODE.Found;
    }
  }

  if (req) {
    // TODO(mcgear): Add basePattern to call, and if req provided, run basePattern and append to the location
  }

  const headers = new Headers();

  headers.set("location", location);

  return respond(null, {
    status: status,
    headers,
  });
}

export function respond(
  body: string | Record<string, unknown> | unknown[] | null,
  init?: ResponseInit,
) {
  if (body && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  return new Response(body, {
    ...{ status: STATUS_CODE.OK },
    ...(init || {}),
  });
}
