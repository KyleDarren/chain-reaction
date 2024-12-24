import { useEffect, useRef } from "react";
import Token from './Token';

export default function Canvas(props) {
    const canvasRef = useRef(); // Reference use in the canvas tag

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
    
        let ball_array = [];

        function spawn_balls(existing_balls) {
            let random_x = Math.floor(Math.random() * (window.innerWidth-25 - 25) + 25);
            let random_y = Math.floor(Math.random() * (window.innerHeight-100 - 25) + 25);
            let random_color = Math.floor(Math.random() * 2);
            let new_token;
            if (random_color == 1) {
                new_token = new Token(ctx, canvas, random_x, random_y, 10, "blue");
            } else {
                new_token = new Token(ctx, canvas, random_x, random_y, 10, "red");
            }

            

            if (existing_balls.length == 0) {
                return new_token;
            }
            else if (existing_balls.length > 0) {
                let overlap = false;

                existing_balls.forEach(element => {
                    if (new_token.checkOverlap(element) == true) {
                        overlap = true;
                    }
                });
                
                if (overlap == false) {
                    return new_token;
                }
                
                return null;
            }
        }


        for (let i=0; i < 60; i++) {
            let new_token = null;
            while (new_token == null) {
                new_token = spawn_balls(ball_array);
            }
            ball_array.push(new_token);
        }

        
        // let token1 = new Token(ctx, canvas, 200, 50, 30, "blue");
        // let token2 = new Token(ctx, canvas, 600, 450, 30, "blue");
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "black";
            ctx.fillRect(0,0, window.innerWidth, window.innerHeight);

            for (let i=0; i < ball_array.length; i++) {
                for (let j=0; j < ball_array.length; j++) {
                    if (ball_array[i] != ball_array[j]) {
                        ball_array[i].drawLine(ball_array[j]);
                        if (ball_array[i].collission(ball_array[j])) {
                            ball_array[i].resolveCollision(ball_array[j])
                            
                        }
                    }
                }

                ball_array[i].move();
            }
            // token1.move();
            // token2.move2();
            // token1.collission(token2);
            // token1.drawLine(token2);
            // token2.collission(token1);
            // token2.drawLine(token1);


            animationFrameId = requestAnimationFrame(animate);
        };
    
        animate();
    
        return () => cancelAnimationFrame(animationFrameId); // For clean up
      }, []);

    return <canvas ref={canvasRef} {...props}/>
}