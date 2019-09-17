const __isIE11=false;
const c = window.configurator;


const _shoes = {
    AM270AMFA19_NIKE: require('./data/AM270AMFA19_NIKE'),
};


export const shoes = {
    AM270AMFA19_NIKE: _shoes.AM270AMFA19_NIKE,
};

export const initialize = ({ callback }) => {

    const config = {

        "antialias": __isIE11 ? false : true,
        "max_pixel_ratio": __isIE11 ? 1 : 1.5,
        "paths": {
            "content_root": window.location.origin + '/content',
            "source_root": window.location.origin + '/configurator',
        },
        'light': {
            'min': {
                'position': [-15, 10, 25],
                'target': [0, 0, 0]
            },
            'max': {
                'position': [15, 4, 5],
                'target': [0, 0, 0]
            }
        },
        "environment": "/textures/env/",
        'camera': {
            'min': {
                'position': [0, 0, 5],
                'target': [0, 0, 0]
            },
            'max': {
                'position': [0, 0, 150],
                'target': [0, 0, 0]
            }
        },
        'start_pose': {
            'shoe_angle': [0, 0, 0],
            'plane_angle': [0, 45, 25]
        },
        'end_pose': {
            'shoe_angle': [0, 0, 0],
            'plane_angle': [25, -45, 0]
        }
    }

    c.Initialize(config, callback);
    window.configurator.SetCameraPose([0, 3, 20], [0, 0, 0]);
    window.configurator.SetLightLevels(.5, .4, 1.5);

}


export const getShoes = () => {
    return Object.keys(shoes);
}