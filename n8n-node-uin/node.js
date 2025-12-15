// n8n-node/uin.node.js - Custom Node für n8n
const { IExecuteFunctions } = require('n8n-workflow');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class UINNode {
    constructor() {
        this.description = {
            displayName: 'UIN Tools',
            name: 'uinTools',
            icon: 'fa:paint-brush',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Work with Universal Image Notation',
            defaults: { name: 'UIN' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Extract Edges', value: 'extractEdges' },
                        { name: 'Generate Prompt', value: 'generatePrompt' },
                        { name: 'Create ControlNet JSON', value: 'createControlNet' }
                    ],
                    default: 'extractEdges',
                },
                {
                    displayName: 'Image Path',
                    name: 'imagePath',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { operation: ['extractEdges'] } },
                    description: 'Path to input image',
                },
                {
                    displayName: 'UIN JSON',
                    name: 'uinJson',
                    type: 'json',
                    default: '',
                    required: true,
                    displayOptions: { 
                        show: { operation: ['generatePrompt', 'createControlNet'] } 
                    },
                }
            ]
        };
    }

    async execute() {
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0);
        
        const returnItems = [];
        
        for (let i = 0; i < items.length; i++) {
            if (operation === 'extractEdges') {
                const imagePath = this.getNodeParameter('imagePath', i);
                
                // Rufe dein Python-Skript auf
                const { stdout } = await execPromise(
                    `python utils/extract_edges.py "${imagePath}" -o ./uin_output`
                );
                
                returnItems.push({
                    json: {
                        result: stdout,
                        edgeMap: `./uin_output/${path.basename(imagePath, path.extname(imagePath))}_edges.png`,
                        uinJson: `./uin_output/${path.basename(imagePath, path.extname(imagePath))}_attributes.uin.json`
                    }
                });
            }
            // ... weitere Operationen ...
        }
        
        return returnItems;
    }
}

module.exports = { UINNode };
