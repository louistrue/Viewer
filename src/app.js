import * as THREE from 'three';
import * as OBC from 'openbim-components';

async function initializeComponents() {
    const container = document.getElementById('container');
    const components = new OBC.Components();

    // Initialize renderer, scene, camera, and raycaster
    const renderer = new OBC.PostproductionRenderer(components, container);
    components.renderer = renderer;
    components.scene = new OBC.SimpleScene(components);
    components.camera = new OBC.SimpleCamera(components);
    components.raycaster = new OBC.SimpleRaycaster(components);
    await components.init();

    renderer.postproduction.enabled = true;

    // Setup scene
    const scene = components.scene.get();
    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
    const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
    const gridMesh = grid.get();
    renderer.postproduction.customEffects.excludedMeshes.push(gridMesh);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    // Setup toolbar
    const mainToolbar = new OBC.Toolbar(components, { name: 'Main Toolbar', position: 'bottom' });
    components.ui.addToolbar(mainToolbar);

    // Initialize and setup the fragment IFC loader
    const fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
    await fragmentIfcLoader.setup();  // Configure loader
    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    // Access the loader's UI element directly and add to the toolbar
    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    mainToolbar.addChild(ifcButton);

    return components;
}

// Initialize everything
initializeComponents().then(components => {
    if (!components) {
        console.error("Failed to initialize the application.");
    } else {
        console.log("Application initialized successfully.");
    }
});
