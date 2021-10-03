            //range
                //range1
                var xmlns = "http://www.w3.org/2000/svg",
                    select = function(s) {
                                        return document.querySelector(s);
                                    },
                    selectAll = function(s) {
                                        return document.querySelectorAll(s);
                                    },
                    container = select('.container'),
                    dragger = select('#dragger'),
                    dragVal,
                    maxDrag = 300


                TweenMax.set('svg', {
                                    visibility: 'visible'
                                })

                TweenMax.set('#upText', {
                                    alpha: 0,
                                    transformOrigin: '50% 50%'
                                })

                TweenMax.set('#downText', {
                                    alpha: 1,
                                    transformOrigin: '50% 50%'
                                })


                TweenLite.defaultEase = Elastic.easeOut.config(0.75, 0.2);

                var tl = new TimelineMax({
                                    paused: false
                                });
                tl
                    .addLabel("blobUp")
                    .to('#display', 1, {
                                        attr: {
                                                            cy: '-=40',
                                                            r: 30
                                                        }
                                    })
                    .to('#dragger', 1, {
                                        attr: {
                                                            //cy:'-=2',
                                                            r: 8
                                                        }
                                    }, '-=1')
                    .set('#dragger', {
                                        strokeWidth: 4
                                    }, '-=1')
                    .to('.downText', 1, {
                                        //alpha:0,
                                        alpha: 0,
                                        transformOrigin: '50% 50%'
                                    }, '-=1')
                    .to('.upText', 1, {
                                        //alpha:1,
                                        alpha: 1,
                                        transformOrigin: '50% 50%'
                                    }, '-=1')
                    .addPause()
                    .addLabel("blobDown")
                    .to('#display', 1, {
                                        attr: {
                                                            cy: 299.5,
                                                            r: 0
                                                        },
                                        ease: Expo.easeOut
                                    })
                    .to('#dragger', 1, {
                                        attr: {
                                                            //cy:'-=35',
                                                            r: 15
                                                        }
                                    }, '-=1')
                    .set('#dragger', {
                                        strokeWidth: 0
                                    }, '-=1')
                    .to('.downText', 1, {
                                        alpha: 1,
                                        ease: Power4.easeOut
                                    }, '-=1')
                    .to('.upText', 0.2, {
                                        alpha: 0,
                                        ease: Power4.easeOut,
                                        attr: {
                                                            y: '+=45'
                                                        }
                                    }, '-=1')

                Draggable.create(dragger, {
                                    type: 'x',
                                    cursor: 'pointer',
                                    throwProps: true,
                                    bounds: {
                                                        minX: 0,
                                                        maxX: maxDrag
                                                    },
                                    onPress: function() {

                                                        tl.play('blobUp')
                                                    },
                                    onRelease: function() {
                                                        tl.play('blobDown')
                                                    },
                                    onDrag: dragUpdate,
                                    onThrowUpdate: dragUpdate
                                })

                function dragUpdate() {
                                    dragVal = Math.round(((this.target._gsTransform.x / maxDrag) * 27)+3);

                                    select('.downText').textContent = select('.upText').textContent = dragVal;
                                    TweenMax.to('#display', 1.3, {
                                                        x: this.target._gsTransform.x
                                                    })
                                    updateSliderW(dragVal)
                                    TweenMax.staggerTo(['.upText', '.downText'], 1, {
                                                        // x:this.target._gsTransform.x,
                                                        cycle: {
                                                                            attr: [{
                                                                                                x: this.target._gsTransform.x + 146
                                                                                            }]
                                                                        },
                                                        ease: Elastic.easeOut.config(1, 0.4)
                                                    }, '0.02')
                                }

                TweenMax.to(dragger, 1, {
                                    x: 150,
                                    onUpdate: dragUpdate,
                                    ease: Power1.easeInOut
                                })

                //------------range2------------//
                var dragger2 = select('#dragger2'),
                    dragVal2 = 0,
                    maxDrag = 300


                TweenMax.set('svg', {
                                    visibility: 'visible'
                                })

                TweenMax.set('#upText2', {
                                    alpha: 0,
                                    transformOrigin: '50% 50%'
                                })

                TweenLite.defaultEase = Elastic.easeOut.config(0.75, 0.2);

                var tl2 = new TimelineMax({
                                    paused: false
                                });
                tl2.addLabel("blobUp2")
                    .to('#display2', 1, {
                                        attr: {
                                                            cy: '-=40',
                                                            r: 30
                                                        }
                                    })
                    .to('#dragger2', 1, {
                                        attr: {
                                                            //cy:'-=2',
                                                            r: 8
                                                        }
                                    }, '-=1')
                    .set('#dragger2', {
                                        strokeWidth: 4
                                    }, '-=1')
                    .to('.downText2', 1, {
                                        //alpha:0,
                                        alpha: 0,
                                        transformOrigin: '50% 50%'
                                    }, '-=1')
                    .to('.upText2', 1, {
                                        //alpha:1,
                                        alpha: 1,
                                        transformOrigin: '50% 50%'
                                    }, '-=1')
                    .addPause()
                    .addLabel("blobDown2")
                    .to('#display2', 1, {
                                        attr: {
                                                            cy: 299.5,
                                                            r: 0
                                                        },
                                        ease: Expo.easeOut
                                    })
                    .to('#dragger2', 1, {
                                        attr: {
                                                            //cy:'-=35',
                                                            r: 15
                                                        }
                                    }, '-=1')
                    .set('#dragger2', {
                                        strokeWidth: 0
                                    }, '-=1')
                    .to('.downText2', 1, {
                                        alpha: 1,
                                        ease: Power4.easeOut
                                    }, '-=1')
                    .to('.upText2', 0.2, {
                                        alpha: 0,
                                        ease: Power4.easeOut,
                                        attr: {
                                                            y: '+=45'
                                                        }
                                    }, '-=1')

                Draggable.create(dragger2, {
                                    type: 'x',
                                    cursor: 'pointer',
                                    throwProps: true,
                                    bounds: {
                                                        minX: 0,
                                                        maxX: maxDrag
                                                    },
                                    onPress: function() {

                                                        tl2.play('blobUp2')
                                                    },
                                    onRelease: function() {
                                                        tl2.play('blobDown2')
                                                    },
                                    onDrag: dragUpdate2,
                                    onThrowUpdate: dragUpdate2

                                })
                function dragUpdate2() {
                                    dragVal2 = Math.round(((this.target._gsTransform.x / maxDrag) * 28)+2);
                                    select('.downText2').textContent = select('.upText2').textContent = dragVal2;
                                    TweenMax.to('#display2', 1.3, {
                                                        x: this.target._gsTransform.x
                                                    })
                                    updateSliderH(dragVal2)
                                    TweenMax.staggerTo(['.upText2', '.downText2'], 1, {
                                                        // x:this.target._gsTransform.x,
                                                        cycle: {
                                                                            attr: [{
                                                                                                x: this.target._gsTransform.x + 146
                                                                                            }]
                                                                        },
                                                        ease: Elastic.easeOut.config(1, 0.4)
                                                    }, '0.02')
                                }

                TweenMax.to(dragger2, 1, {
                                    x: 150,
                                    onUpdate: dragUpdate2,
                                    ease: Power1.easeInOut
                                })


                //range


                let colorsArray = [
                                    "63b598", "ce7d78", "ea9e70", "a48a9e", "c6e1e8", "648177", "0d5ac1",
                                    "f205e6", "1c0365", "14a9ad", "4ca2f9", "a4e43f", "d298e2", "6119d0",
                                    "d2737d", "c0a43c", "f2510e", "651be6", "79806e", "61da5e", "cd2f00",
                                    "9348af", "01ac53", "c5a4fb", "996635", "b11573", "4bb473", "75d89e",
                                    "2f3f94", "2f7b99", "da967d", "34891f", "b0d87b", "ca4751", "7e50a8",
                                    "c4d647", "e0eeb8", "11dec1", "289812", "566ca0", "ffdbe1", "2f1179",
                                    "935b6d", "916988", "513d98", "aead3a", "9e6d71", "4b5bdc", "0cd36d",
                                    "250662", "cb5bea", "228916", "ac3e1b", "df514a", "539397", "880977",
                                    "f697c1", "ba96ce", "679c9d", "c6c42c", "5d2c52", "48b41b", "e1cf3b",
                                    "5be4f0", "57c4d8", "a4d17a", "225b8", "be608b", "96b00c", "088baf",
                                    "f158bf", "e145ba", "ee91e3", "05d371", "5426e0", "4834d0", "802234",
                                    "6749e8", "0971f0", "8fb413", "b2b4f0", "c3c89d", "c9a941", "41d158",
                                    "fb21a3", "51aed9", "5bb32d", "807fb", "21538e", "89d534", "d36647",
                                    "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
                                    "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
                                    "1bb699", "6b2e5f", "64820f", "1c271", "21538e", "89d534", "d36647",
                                    "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
                                    "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
                                    "1bb699", "6b2e5f", "64820f", "1c271", "9cb64a", "996c48", "9ab9b7",
                                    "06e052", "e3a481", "0eb621", "fc458e", "b2db15", "aa226d", "792ed8",
                                    "73872a", "520d3a", "cefcb8", "a5b3d9", "7d1d85", "c4fd57", "f1ae16",
                                    "8fe22a", "ef6e3c", "243eeb", "1dc18", "dd93fd", "3f8473", "e7dbce",
                                    "421f79", "7a3d93", "635f6d", "93f2d7", "9b5c2a", "15b9ee", "0f5997",
                                    "409188", "911e20", "1350ce", "10e5b1", "fff4d7", "cb2582", "ce00be",
                                    "32d5d6", "17232", "608572", "c79bc2", "00f87c", "77772a", "6995ba",
                                    "fc6b57", "f07815", "8fd883", "060e27", "96e591", "21d52e", "d00043",
                                    "b47162", "1ec227", "4f0f6f", "1d1d58", "947002", "bde052", "e08c56",
                                    "28fcfd", "bb09b", "36486a", "d02e29", "1ae6db", "3e464c", "a84a8f",
                                    "911e7e", "3f16d9", "0f525f", "ac7c0a", "b4c086", "c9d730", "30cc49",
                                    "3d6751", "fb4c03", "640fc1", "62c03e", "d3493a", "88aa0b", "406df9",
                                    "615af0", "4be47", "2a3434", "4a543f", "79bca0", "a8b8d4", "00efd4",
                                    "7ad236", "7260d8", "1deaa7", "06f43a", "823c59", "e3d94c", "dc1c06",
                                    "f53b2a", "b46238", "2dfff6", "a82b89", "1a8011", "436a9f", "1a806a",
                                    "4cf09d", "c188a2", "67eb4b", "b308d3", "fc7e41", "af3101", "ff065",
                                    "71b1f4", "a2f8a5", "e23dd0", "d3486d", "00f7f9", "474893", "3cec35",
                                    "1c65cb", "5d1d0c", "2d7d2a", "ff3420", "5cdd87", "a259a4", "e4ac44",
                                    "1bede6", "8798a4", "d7790f", "b2c24f", "de73c2", "d70a9c", "25b67",
                                    "88e9b8", "c2b0e2", "86e98f", "ae90e2", "1a806b", "436a9e", "0ec0ff",
                                    "f812b3", "b17fc9", "8d6c2f", "d3277a", "2ca1ae", "9685eb", "8a96c6",
                                    "dba2e6", "76fc1b", "608fa4", "20f6ba", "07d7f6", "dce77a", "77ecca"];
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

                var light = new THREE.HemisphereLight(0xf6e86d, 0x404040, 0.5);

                scene.add(light);			

                const renderer = new THREE.WebGLRenderer();
                renderer.setSize( window.innerWidth, window.innerHeight );
                document.body.appendChild( renderer.domElement );


                window.addEventListener( 'resize', onWindowResize, false );
                let r,w,h

                let colorMain = new THREE.Color();
                colorMain.setHex(`0x03A9F4`);


                window.onload = function() {
                                    r=2.5
                                    w=15
                                    h=15
                                    onChange()	
                                    circleBack(r, w,h)
                                };

                function updateSliderW(wid){
                                    w=wid
                                    checkWire(check)
                                    //circleBack(r, w, h)
                                }

                function updateSliderH(hei){
                                    h=hei
                                    checkWire(check)
                                    //circleBack(r, w, h)
                                }


                function onWindowResize(){
                                    camera.aspect = window.innerWidth / window.innerHeight;
                                    camera.updateProjectionMatrix();

                                    renderer.setSize( window.innerWidth, window.innerHeight );

                                }
                function onChange(rad, wid, hei){
                                    let radius = 0.4,
                                        widthSeg=3,
                                        heightSeg=3
                                    const geometry = new THREE.SphereGeometry(radius,widthSeg,heightSeg);
                                    const material =   new THREE.MeshLambertMaterial({
                                                        color: 0x003A9F4
                                                    });
                                    camera.position.z = 5;
                                    function circle(offset){
                                                        let xPos = -10	
                                                        while(xPos<=7){
                                                                            color = new THREE.Color();
                                                                            color.setHex(`0x${colorsArray[Math.floor(Math.random() * colorsArray.length)]}`);
                                                                            if (color < 500) {color.setHex(500);}


                                                                            const material =   new THREE.MeshLambertMaterial({
                                                                                                color:color
                                                                                            });

                                                                            const sphere = new THREE.Mesh( geometry, material );
                                                                            scene.add( sphere );

                                                                            sphere.translateZ(-3)
                                                                            xPos+=1.25
                                                                            let origOffset = Math.random()*4
                                                                            let yPos = (origOffset)+offset;
                                                                            sphere.translateX(xPos)
                                                                            sphere.translateY(yPos)
                                                                            const animate = function () {
                                                                                                requestAnimationFrame( animate );
                                                                                                yPos-=0.015
                                                                                                sphere.translateY(-0.015);
                                                                                                sphere.rotation.y +=(Math.random()* 0.01);
                                                                                                if(yPos < -7){

                                                                                                                    yPos += 15;
                                                                                                                    sphere.translateY(15)
                                                                                                                }
                                                                                                renderer.render( scene, camera );
                                                                                            };

                                                                            animate();
                                                                        }
                                                    }
                                    circle(5)
                                    circle(10)
                                    circle(15)

                                }
                let rotX=0, rotY=0
                function circleBack(rad, wid, hei){
                                    let radius = r,
                                        widthSeg=wid,
                                        heightSeg=hei
                                    const geometry = new THREE.SphereGeometry(radius,widthSeg,heightSeg);

                                    const material =   new THREE.MeshLambertMaterial({
                                                        color: colorMain
                                                    });

                                    const material2 = new THREE.MeshBasicMaterial({
                                                        color: 0xffffff,
                                                        wireframe: true
                                                    });

                                    if(scene.getObjectByName('sphere')){

                                                        scene.remove(scene.getObjectByName('wire'))
                                                        scene.remove(scene.getObjectByName('sphere'))
                                                    }

                                    const wire = new THREE.Mesh( geometry, material2 );
                                    const sphere = new THREE.Mesh( geometry, material );
                                    scene.add( sphere );
                                    scene.add( wire ); 
                                    sphere.name='sphere'
                                    wire.name='wire'

                                    sphere.translateY(-0.1)
                                    wire.translateY(-0.1)
                                    camera.position.z = 5;
                                    sphere.rotation.x = rotX;
                                    sphere.rotation.y = rotY;
                                    wire.rotation.x = rotX;
                                    wire.rotation.y = rotY;

                                    const animate = function () {
                                                        requestAnimationFrame( animate );

                                                        sphere.rotation.x += 0.01;
                                                        sphere.rotation.y += 0.01;
                                                        wire.rotation.x += 0.01;
                                                        wire.rotation.y += 0.01;
                                                        rotX = sphere.rotation.x;
                                                        rotY = sphere.rotation.y;
                                                        renderer.render( scene, camera );
                                                    };

                                    animate();
                                }
                let check = true
                function checkWire(checked){
                                    check=checked
                                    if(check) {
                                                        circleBack(r,w,h)
                                                    }else{
                                                                        //circleBack w no wire

                                                                        let radius = r,
                                                                            widthSeg=w,
                                                                            heightSeg=h
                                                                        const geometry = new THREE.SphereGeometry(radius,widthSeg,heightSeg);

                                                                        const material =   new THREE.MeshLambertMaterial({
                                                                                            color: colorMain
                                                                                        });
                                                                        if(scene.getObjectByName('sphere')){

                                                                                            scene.remove(scene.getObjectByName('wire'))
                                                                                            scene.remove(scene.getObjectByName('sphere'))
                                                                                        }

                                                                        const sphere = new THREE.Mesh( geometry, material );
                                                                        scene.add( sphere );
                                                                        sphere.name='sphere'

                                                                        sphere.translateY(-0.1)
                                                                        camera.position.z = 5;

                                                                        //console.log(rot)
                                                                        sphere.rotation.x = rotX;
                                                                        sphere.rotation.y = rotY;
                                                                        const animate = function () {
                                                                                            requestAnimationFrame( animate );

                                                                                            sphere.rotation.x += 0.01;
                                                                                            sphere.rotation.y += 0.01;

                                                                                            rotX = sphere.rotation.x;
                                                                                            rotY = sphere.rotation.y;
                                                                                            renderer.render( scene, camera );
                                                                                        };

                                                                        animate();

                                                                    }

                                }

                function colorChange(id){
                                    console.log(id.value)
                                    colorMain.setHex(`0x${id.value.substring(1)}`);
                                    checkWire(check)
                                    //set global for checked and then we can use it no matter what the call
                                }



