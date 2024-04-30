import * as THREE from 'three';
import * as OBC from 'openbim-components';

async function initializeComponents() {
    const container = document.getElementById('container');
    const components = new OBC.Components();

    components.renderer = new OBC.SimpleRenderer(components, container);
    components.scene = new OBC.SimpleScene(components);
    components.camera = new OBC.SimpleCamera(components);
    components.raycaster = new OBC.SimpleRaycaster(components);
    await components.init();

    setupScene(components);
    addLighting(components.scene.get());
    await setupToolbar(components);

    return components;
}

function setupScene(components) {
    const scene = components.scene.get();
    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
    const grid = new OBC.SimpleGrid(components);
    scene.add(grid.mesh);
}

function addLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);
}

async function setupToolbar(components) {
    const mainToolbar = new OBC.Toolbar(components, {name: 'Main Toolbar', position: 'bottom'});
    components.ui.addToolbar(mainToolbar);

    // Initialize and setup the fragment IFC loader
    const fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
    await fragmentIfcLoader.setup();  // Configure loader
    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    // Access the loader's UI element directly and add to the toolbar
    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    mainToolbar.addChild(ifcButton);
}

// Initialize everything
initializeComponents().then(components => {
    if (!components) {
        console.error("Failed to initialize the application.");
    } else {
        console.log("Application initialized successfully.");
    }
});
