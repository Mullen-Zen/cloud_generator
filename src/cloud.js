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
            spheresPerCloud = 20,
            sphereRadius = 1,
            sphereScaleRange = [0.5, 1.5], // random scale multiplier
            spread = 3 // how far each sphere can stray from the origin
        } = options;
        const segments = [16, 16];
        const cloudColor = 0xffffff;
        const geometry = new SphereGeometry(sphereRadius, segments[0], segments[1]);
        const material = new MeshStandardMaterial({
            color: cloudColor,
            flatShading: true,
            transparent: true,
            opacity: 0.8
        });

        // set up/assign vals to each sphere generated
        for (let i = 0; i < spheresPerCloud; i++) {
            const mesh = new Mesh(geometry, material);

            // random position within acceptable spread range
            mesh.position.set(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread * 0.6,
                (Math.random() - 0.5) * spread
            );

            // random scale within acceptable scale range
            const scale = Math.random() * (sphereScaleRange[1] - sphereScaleRange[0]) + sphereScaleRange[0];
            mesh.scale.set(scale, scale, scale);

            // add cloud sphere to group
            this.add(mesh);
        }
    };
}