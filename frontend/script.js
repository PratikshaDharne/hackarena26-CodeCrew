// Animate hero section
gsap.from(".hero-title", {y:-50, opacity:0, duration:1});
gsap.from(".hero-subtitle", {y:50, opacity:0, duration:1, delay:0.5});
gsap.from(".btn", {scale:0, duration:1, delay:1, ease:"elastic.out(1,0.5)"});