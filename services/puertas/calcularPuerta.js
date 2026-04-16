<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>Puertas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fade-in {
            animation: fade-in 0.3s ease;
        }
    </style>
</head>

<body class="bg-gray-100">

    <div class="min-h-screen flex flex-col">

        <!-- HEADER -->
        <header class="bg-white shadow p-4 flex justify-between items-center">
            <button onclick="volver()" class="text-sm text-gray-500 hover:text-black">
                ← Volver
            </button>

            <h1 class="font-bold">Puertas</h1>

            <div></div>
        </header>

        <!-- CONTENIDO -->
        <div class="flex-1 flex items-center justify-center">

            <div class="w-full max-w-md p-6 space-y-4 animate-fade-in">

                <div class="grid grid-cols-2 gap-4">

                    <!-- SIMPLE -->
                    <div onclick="seleccionar('simple')"
                        class="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition text-center">
                        🚪 Puertas
                        <div class="text-xs text-gray-500">70 / 80 / 90</div>
                    </div>

                    <!-- MEDIA -->
                    <div onclick="seleccionar('media')"
                        class="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition text-center">
                        🚪 Puertas y media
                        <div class="text-xs text-gray-500">110 / 120 / 130</div>
                    </div>

                    <!-- DOBLE -->
                    <div onclick="seleccionar('doble')"
                        class="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition text-center">
                        🚪 Dobles
                        <div class="text-xs text-gray-500">140 / 160 / 180</div>
                    </div>

                    <!-- PORTON -->
                    <div onclick="seleccionar('porton')"
                        class="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition text-center">
                        🚪 Portones
                        <div class="text-xs text-gray-500">210 / 240 / 270</div>
                    </div>

                    <!-- ECO (placeholder) -->
                    <div class="bg-white p-6 rounded-xl shadow opacity-40 text-center">
                        🚪 ECO
                    </div>

                </div>

            </div>

        </div>

    </div>

    <script type="module">
        import { Auth } from "../js/core/auth.js";

        Auth.requireAuth();

        // 🔙 volver
        window.volver = () => {
            window.location.href = "./dashboard.html";
        };

        // 🔥 seleccionar tipo de puerta
        window.seleccionar = (tipo) => {
            localStorage.setItem("tipoPuerta", tipo);
            window.location.href = "./nuevo.html";
        };
    </script>

</body>

</html>