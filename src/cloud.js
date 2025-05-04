import {
    Group, 
    Mesh, 
    SphereGeometry, 
    MeshStandardMaterial} from 'three';

// extend the group class to cloud because we want groups of clouds, not just single clouds
export class Cloud extends Group {
    constructor(options = {}) {
        // parents
        super();

        // constants, geometry, mats
        const {
            spheresPerCloud = 25,
            sphereRadius = 1,
            sphereScaleRange = [0.5, 1.5], // random scale multiplier
            spread = 1 // how far each sphere can stray from the origin
        } = options;
        const segments = [100, 100];
        const cloudColor = 0xffffff;
        const geometry = new SphereGeometry(sphereRadius, segments[0], segments[1]);
        const material = new MeshStandardMaterial({
            color: cloudColor,
            flatShading: true,
            transparent: true,
        });

        // set up/assign vals to each sphere generated
        for (let i = 0; i < spheresPerCloud; i++) {
            // random scale within acceptable scale range
            const scale = Math.random() * (sphereScaleRange[1] - sphereScaleRange[0]) + sphereScaleRange[0];

  
            // material.opacity = 0.7 + (Math.random() * 0.8);
            // material.opacity = scale / (sphereScaleRange[1] - 0.2);
            material.opacity = 1;
            const mesh = new Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // random position within acceptable spread range
            mesh.position.set(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread * 0.4,
                (Math.random() - 0.5) * spread
            );
            mesh.scale.set(scale, scale * 0.75, scale);

            const mergedGeo = 

            // add cloud sphere to group
            this.add(mesh);
        }
    };
}