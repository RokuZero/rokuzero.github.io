let resource = {};

resource.init = function(assets, callback) {
	let loader = PIXI.Loader.shared;

	for(let key in assets) {
		let path = assets[key];
		loader.add(key, path)
	}

	loader.load(callback);
};

resource.getTexture = function(key) {
	let loader = PIXI.Loader.shared;

	if(key in loader.resources) {
		let rsrc = loader.resources[key];
		if(rsrc.type === PIXI.LoaderResource.TYPE.IMAGE) {
			return rsrc.texture;
		}
	}

	return false;
};

resource.getJSON = function(key) {
	let loader = PIXI.Loader.shared;

	if(key in loader.resources) {
		let rsrc = loader.resources[key];
		if(rsrc.type === PIXI.LoaderResource.TYPE.JSON) {
			return rsrc.data;
		}
	}

	return false;
};
