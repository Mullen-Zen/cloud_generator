// cloud.js | class to handle cloud creation
// Garrison Mullen

// imports
import {
    Group, 
    Mesh, 
    SphereGeometry, 
    MeshStandardMaterial} from 'three';

// a single cloud here is just a bunch of spheres clumped together nicely
export class Cloud extends Group {
    // extend the group class because a cloud here is just a *group* of spheres
    constructor(options = {}) {
        super();

        // constants, geometry, mats
        const {
            spheresPerCloud = 25,
            sphereRadius = 1,
            sphereScaleRange = [0.5, 1.5], // random scale multiplier
            spread = 1 // how far each sphere can stray from the origin by default
        } = options;
        const segments = [100, 100]; // detail per sphere per cloud (tweak for performance)
        const geometry = new SphereGeometry(sphereRadius, segments[0], segments[1]);
        const material = new MeshStandardMaterial({
            color: 0xffffff,
            flatShading: true,
            transparent: true,
        });

        // set up/assign vals to each sphere generated
        for (let i = 0; i < spheresPerCloud; i++) {
            // random scale within acceptable scale range
            const scale = Math.random() * (sphereScaleRange[1] - sphereScaleRange[0]) + sphereScaleRange[0];
            material.opacity = 1; // i really wanted to tweak opacity to look more "realistic" but with how these are generated full opaque looks best i think
            const mesh = new Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // random position/scale within acceptable spread range
            mesh.position.set(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread * 0.4,
                (Math.random() - 0.5) * spread
            );
            mesh.scale.set(scale, scale * 0.75, scale);

            // add cloud sphere to object
            this.add(mesh);
        }
    };
}