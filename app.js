/**
 * TO-DO:
 * - Research the Dolch and Banajee vocabulary lists for the "transition" lists
 */
(async function(){
	// Register the Service Worker, if able; then listen for app updates and prompt to upgrade
	let iSW, refreshingPage;
	if (location.protocol.includes("http")) {
		update_btn.addEventListener("click", () => iSW.postMessage({ action: "skipWaiting" }));

		navigator.serviceWorker.register("sw.js", { scope: location.pathname })
		.then(reg => {
			reg.addEventListener("updatefound", () => {
				iSW = reg.installing;
				iSW.addEventListener("statechange", function() {
					if (this.state !== "installed") return;
					if (navigator.serviceWorker.controller) update_btn.hidden = false;
				});
			});
		})
		.catch(err => alert(JSON.stringify(err)));

		// Reload the page after the serviceWorker controller has changed to the latest version
		navigator.serviceWorker.addEventListener("controllerchange", () => location.reload(), { once: true });
	}

	/*document.querySelectorAll("[data-word]").forEach(div => {
		//
	});*/
	const MODE = {
		0: "One-Touch",
		1: "Sequenced"
	},
	activeMode = localStorage.activeMode || 0;

	// Store the word and SpeechSynthesis utterance of the word
	const wordlist = localStorage.wordlist || new Array(84),
				wordgrid = Array.from(words.querySelectorAll("button"));

	wordgrid.forEach(node => {
		const word = node.dataset?.word;
		if (!word || word === "CLEAR") {
			node.addEventListener("click", () => query.value = "");
			return;
		}
		node.style.backgroundImage = `url(images/${word.replace("/", "")}.svg)`;
		//TODO Add click event listeners for the special functions these buttons perform
		switch (word) {
			case "+s":
				node.addEventListener("click", () => query.value += "s");
				return;
			case "SPELL/NUM":
				node.addEventListener("click", () => {
					keyboard.hidden = !keyboard.hidden;
					if (words.style.display) {
						words.removeAttribute("style");
						return;
					}
					words.style.display = "none";
				});
				return;
			default:
		}
		wordlist[wordgrid.findIndex(obj => obj.dataset?.word === word)] = { word, utterance: new SpeechSynthesisUtterance(word) };
		node.addEventListener("click", event => speechSynthesis.speak(wordlist.filter(obj => obj.word === event.target.dataset?.word)[0].utterance));
	});

	vocab_btn.addEventListener("click", event => {
		vocab.hidden = !vocab.hidden;
		if (words.style.display) {
			words.removeAttribute("style");
			return;
		}
		words.style.display = "none";
	});

	menu_dialog.addEventListener("close", function(event) {
		const rval = this.returnValue;
		if (rval === "cancel") return;
	});

	const saveAs = (data, filename = "untitled", type = "text/plain") => {
		if (typeof data !== "string") throw TypeError("Input data must be of type String");
		showSaveFilePicker().then(async handle => {
			const stream = await handle.createWritable({
				suggestedName: filename,
				types: [{
					description: "CSV File",
					accept: {
						"text/csv": [".csv"]
					}
				}]
			});
			await stream.write(new Blob([data], { type }));
			await stream.close();
		});
	};
})();
