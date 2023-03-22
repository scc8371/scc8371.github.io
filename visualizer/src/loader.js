import * as main from "./main.js";
import * as sprite from "./sprite.js"

window.onload = () => {
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	let xhr = new XMLHttpRequest();

	xhr.onload = () => {
		if (xhr.status == 200) {
			console.log("xhr status OK!");
			//read in JSON data
			let data = JSON.parse(xhr.responseText);

			if (data.drawParams.images) {
				let images = [];
				data.drawParams.images.forEach((image) => {

					for (let i = 0; i < 5; i++) {
						//create sprite
						let spriteInst = new sprite.Sprite(image.path, image.x, image.y, image.width, image.height);
						images.push(spriteInst);
					}
				});

				data.drawParams.images = images;
			}

			let title = document.querySelector("title");
			title.innerHTML = data.title;

			//copies data to main.controllerObject
			Object.assign(main.controllerObject, data);

			// 2 - start up app
			main.init();
		}
		else {
			console.log("XHR error: " + xhr.status + " - " + xhr.statusText);
		}
	}

	xhr.open("GET", "./data/av-data.json");
	xhr.send();
}