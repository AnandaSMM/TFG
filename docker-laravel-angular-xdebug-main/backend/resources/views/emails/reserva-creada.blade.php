<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>

<body style="
    margin:0;
    padding:40px 20px;
    background:#f4f6f8;
    font-family:Arial, sans-serif;
    color:#1f2937;
">

<div style="
    max-width:620px;
    margin:auto;
    background:white;
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 10px 25px rgba(0,0,0,0.08);
">

    <!-- HEADER -->
    <div style="
        background:linear-gradient(90deg,#2c3e90,#ff6a00);
        padding:28px 36px;
    ">
        <h1 style="
            margin:0;
            color:white;
            font-size:34px;
            font-weight:800;
        ">
            Rent2Play
        </h1>

        <p style="
            margin:8px 0 0;
            color:rgba(255,255,255,0.9);
            font-size:15px;
        ">
            Marketplace de alquiler deportivo
        </p>
    </div>

    <!-- CONTENT -->
    <div style="padding:36px;">

        <h2 style="
            margin-top:0;
            font-size:28px;
            color:#2c3e90;
        ">
            Nueva reserva recibida
        </h2>

        <p style="
            font-size:16px;
            line-height:1.7;
            color:#4b5563;
        ">
            {{ $alquiler->usuario->nombre }} ha reservado uno de tus productos.
        </p>

        <!-- CARD INFO -->
        <div style="
            background:#f8fafc;
            border:1px solid #e5e7eb;
            border-radius:18px;
            padding:24px;
            margin:28px 0;
        ">

            <p>
                <strong style="color:#2c3e90;">Producto:</strong>
                {{ $alquiler->producto->nombre }}
            </p>

            <p>
                <strong style="color:#2c3e90;">Usuario:</strong>
                {{ $alquiler->usuario->nombre }}
            </p>

            <p>
                <strong style="color:#2c3e90;">Fecha inicio:</strong>
                {{ $alquiler->fecha_inicio }}
            </p>

            <p>
                <strong style="color:#2c3e90;">Fecha fin:</strong>
                {{ $alquiler->fecha_fin }}
            </p>

            <div style="margin-top:20px;">
                <span style="
                    background:#fff7ed;
                    color:#ff6a00;
                    padding:10px 18px;
                    border-radius:999px;
                    font-size:14px;
                    font-weight:bold;
                ">
                    Reserva confirmada
                </span>
            </div>

        </div>

        <!-- BUTTON -->
        <div style="text-align:center; margin-top:32px;">
            <a 
                href="{{ env('FRONTEND_URL') }}/home"
                style="
                    display:inline-block;
                    background:linear-gradient(90deg,#2c3e90,#ff6a00);
                    color:white;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:14px;
                    font-weight:bold;
                    font-size:15px;
                "
            >
                Ir a Rent2Play
            </a>
        </div>

        <p style="
            margin-top:32px;
            font-size:14px;
            color:#6b7280;
            line-height:1.6;
        ">
            Puedes revisar el estado de tus alquileres desde tu cuenta de Rent2Play.
        </p>

    </div>

    <!-- FOOTER -->
    <div style="
        background:#f8fafc;
        border-top:1px solid #e5e7eb;
        padding:20px;
        text-align:center;
        font-size:13px;
        color:#6b7280;
    ">
        © Rent2Play · Sistema automático de notificaciones
    </div>

</div>

</body>
</html>