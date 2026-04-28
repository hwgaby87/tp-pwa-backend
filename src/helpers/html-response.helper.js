import ENVIRONMENT from "../config/environment.config.js";

const getSuccessHTML = (title, message) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #fdfbf7;
                background-image: 
                    radial-gradient(at 0% 0%, hsla(28,100%,74%,0.1) 0, transparent 50%), 
                    radial-gradient(at 50% 0%, hsla(189,100%,56%,0.1) 0, transparent 50%), 
                    radial-gradient(at 100% 0%, hsla(321,100%,78%,0.1) 0, transparent 50%);
                font-family: 'Outfit', sans-serif;
                color: #4a4a4a;
            }

            .container {
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(20px);
                padding: 4rem 3rem;
                border-radius: 32px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                text-align: center;
                max-width: 480px;
                width: 90%;
                border: 1px solid rgba(255, 255, 255, 0.4);
                animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes scaleUp {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }

            .icon-success {
                width: 100px;
                height: 100px;
                background: #e6f7ef;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 auto 2rem;
                position: relative;
            }

            .icon-success::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 2px solid #00b894;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.5; }
                70% { transform: scale(1.3); opacity: 0; }
                100% { transform: scale(1.3); opacity: 0; }
            }

            .icon-success svg {
                width: 50px;
                height: 50px;
                color: #00b894;
                stroke-width: 3;
                animation: checkmark 0.8s ease-in-out forwards;
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
            }

            @keyframes checkmark {
                to { stroke-dashoffset: 0; }
            }

            h1 {
                font-size: 2.2rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #2d3436;
                letter-spacing: -0.02em;
            }

            p {
                font-size: 1.15rem;
                line-height: 1.7;
                color: #636e72;
                margin-bottom: 2.5rem;
            }

            .btn {
                display: inline-block;
                padding: 1.2rem 2.5rem;
                background: #2d3436;
                color: white;
                text-decoration: none;
                border-radius: 16px;
                font-weight: 600;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }

            .btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
                background: #000;
            }

            .footer {
                margin-top: 3rem;
                font-size: 0.95rem;
                color: #a0a0a0;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon-success">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1>${title}</h1>
            <p>${message}</p>
            <a href="${ENVIRONMENT.URL_FRONTEND}" class="btn">Continuar al Acceso</a>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Slake App
            </div>
        </div>
    </body>
    </html>
    `;
};

const getErrorHTML = (title, message) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #fffafa;
                font-family: 'Outfit', sans-serif;
                color: #4a4a4a;
            }

            .container {
                background: #fff;
                padding: 4rem 3rem;
                border-radius: 32px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                text-align: center;
                max-width: 480px;
                width: 90%;
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }

            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }

            .icon-error {
                width: 100px;
                height: 100px;
                background: #fff5f5;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 auto 2rem;
            }

            .icon-error svg {
                width: 50px;
                height: 50px;
                color: #ff7675;
            }

            h1 {
                font-size: 2.2rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #2d3436;
            }

            p {
                font-size: 1.15rem;
                line-height: 1.7;
                color: #636e72;
                margin-bottom: 2.5rem;
            }

            .btn {
                display: inline-block;
                padding: 1.2rem 2.5rem;
                background: #ff7675;
                color: white;
                text-decoration: none;
                border-radius: 16px;
                font-weight: 600;
                transition: all 0.4s ease;
            }

            .btn:hover {
                background: #ff5252;
                transform: translateY(-2px);
            }

            .footer {
                margin-top: 3rem;
                font-size: 0.95rem;
                color: #a0a0a0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon-error">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h1>${title}</h1>
            <p>${message}</p>
            <a href="${ENVIRONMENT.URL_FRONTEND}" class="btn">Volver al Inicio</a>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Slake App
            </div>
        </div>
    </body>
    </html>
    `;
};

export { getSuccessHTML, getErrorHTML };
