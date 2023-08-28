import { DataProvider } from './DataProvider';
import { JsonSchemaProcessor } from './JsonSchemaProcessor';

// Load the JSON Schema
const schema = require('./path/to/schema.json');

// Instantiate the DataProvider with the chosen storage layer implementation
const dataProvider = new DataProvider();

// Instantiate the JsonSchemaProcessor with the JSON Schema and the DataProvider
const jsonSchemaProcessor = new JsonSchemaProcessor(schema, dataProvider);

// Generate the type-safe data access layer
jsonSchemaProcessor.generateDataAccessLayer();