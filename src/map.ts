declare var require: any;
let _ = require('lodash');

export class Map {
    // `layers` are ordered with bottom-most layer first
    layers: number[][][];
    height: number;
    width: number;
    images: {[key: number]: HTMLImageElement}[];
    // `imageSources` are a list of sources (src) to put inside <img> elements
    // when creating a layer of tiles, each tile should reference the index of 
    // its corresponding source in the imageSources list.
    imageSources: string[]
    tileWidth: number;
    tileHeight: number;
    canvas: any;
    context: any

    constructor(canvasID: string, imageSources, layers, tileHeight, tileWdith = tileHeight) {
        this.layers = layers;
        this.height = layers[0].length;
        this.width = layers[0][0].length;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWdith;
        this.canvas = document.getElementById(canvasID);
        this.canvas.height = this.height * this.tileHeight;
        this.canvas.width = this.width * this.tileWidth;
        this.context = this.canvas.getContext('2d');
        this.imageSources = imageSources;
        this.images = [];
        this.setImages();
    }

    setImages(): void {
        _.each(_.range(this.layers.length), layer => {
            _.each(_.range(this.height), row => {
                _.each(_.range(this.width), col => {
                    let index: number = this.layers[layer][row][col];
                    let img = new Image();
                    img.src = this.imageSources[index];
                    this.images.push({});
                    this.images[layer][`${row} ${col}`] = img;
                });
            });
        });
    }

    drawLayer(layer, context = this.context): void {
        _.each(_.range(this.height), row => {
            _.each(_.range(this.width), col => {
                let img = this.images[layer][`${row} ${col}`];
                if (img.src) {
                    let x = col * this.tileHeight;
                    let y = row * this.tileWidth;
                    img.onload = function() {
                        context.drawImage(img, x, y, this.tileHeight, this.tileWidth);
                    }.bind(this);
                };
            })
        })
    }

    draw(context = this.context): void {
        _.each(_.range(this.layers.length), layer => {
            this.drawLayer(layer);
        });
    }
}