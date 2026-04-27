const getEmailTemplate = (content, title = 'Conecta App') => {
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
                background-color: #f8f9fa;
                font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                color: #2d3436;
                line-height: 1.6;
            }
            .email-wrapper {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                border: 1px solid #edf2f7;
            }
            .email-header {
                background: linear-gradient(135deg, #c47c5e 0%, #d68b6d 100%);
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
            }
            .email-header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
                letter-spacing: -0.02em;
            }
            .email-body {
                padding: 40px 30px;
            }
            .email-footer {
                padding: 30px;
                text-align: center;
                font-size: 14px;
                color: #94a3b8;
                background-color: #f8fafc;
                border-top: 1px solid #edf2f7;
            }
            .btn {
                display: inline-block;
                padding: 14px 28px;
                margin: 10px 5px;
                border-radius: 12px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
                text-align: center;
            }
            .btn-primary {
                background-color: #c47c5e;
                color: #ffffff !important;
            }
            .btn-secondary {
                background-color: #f1f5f9;
                color: #4a3f35 !important;
            }
            .content-block {
                margin-bottom: 25px;
            }
            .text-center {
                text-align: center;
            }
            .member-preview {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                background-color: #f8fafc;
                border-radius: 16px;
                margin-bottom: 25px;
            }
            .member-avatar {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background-color: #c47c5e;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 20px;
                object-fit: cover;
            }
            .member-info h3 {
                margin: 0;
                font-size: 18px;
                color: #1e293b;
            }
            .member-info p {
                margin: 0;
                font-size: 14px;
                color: #64748b;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-header">
                <h1>${title}</h1>
            </div>
            <div class="email-body">
                ${content}
            </div>
            <div class="email-footer">
                &copy; ${new Date().getFullYear()} Conecta App. Todos los derechos reservados.
                <br>
                Este es un mensaje automático, por favor no respondas a este correo.
            </div>
        </div>
    </body>
    </html>
    `;
};

export default getEmailTemplate;
