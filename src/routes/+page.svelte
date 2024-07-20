<!DOCTYPE html>
<html>
    <head>
        <style>
            body,
            html {
                margin: 0;
                padding: 0;
                height: 100%;
                background-image: url(../background.jpg);
                background-repeat: no-repeat;
                background-size: cover;
                font-family: Arial, sans-serif;
            }

            .home-screen {
                color: white;
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 0;
                text-align: center;
            }

            a {
                text-decoration: none;
            }

            .title {
                cursor: pointer;
                margin-top: 20vw;
                font-size: 6vw;
                font-weight: bold;
                color: #e6e6fa;
            }

            .title:hover {
                transform: scale(1.1);
                color: #e0ffff;
            }

            .buttons {
                margin-top: 1vw;
                display: flex;
                flex-direction: row;
                gap: 4vw;
            }

            button {
                background-color: transparent;
                color: #f8f8ff;
                border: 2px solid #f8f8ff;
                border-radius: 5px;
                padding: 0.75vw 1.5vw;
                cursor: pointer;
                font-size: 1.2vw;
                transition:
                    background-color 0.3s,
                    color 0.3s;
            }

            button:hover {
                background-color: #f8f8ff;
                color: black;
            }

            .fade-out {
                animation: fadeOutAnimation 1s ease forwards;
            }

            @keyframes fadeOutAnimation {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        </style>
    </head>
    <body class="mainContainer">
        <div class="home-screen">
            <div class="title">Impromptu</div>
            <div class="buttons">
                <a href="/main">
                    <button id="play">Start</button>
                </a>
                <a>
                    <button id="learn"> Tutorial </button>
                </a>
            </div>
        </div>
    </body>
</html>
