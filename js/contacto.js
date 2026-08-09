// Captura del formulario de contacto
const formContacto = document.getElementById("form-contacto");

if (formContacto) {
    formContacto.addEventListener("submit", (e) => {
        // Evita que la página se recargue al enviar
        e.preventDefault();

        // Obtener valores de los campos
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const asunto = document.getElementById("asunto").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        // Validar que ningún campo esté vacío
        if (!nombre || !email || !asunto || !mensaje) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor completá todos los campos antes de enviar.",
                icon: "warning",
                confirmButtonColor: "#0dcaf0"
            });
            return;
        }

        // Simulación de guardado de la consulta
        const nuevaConsulta = {
            nombre,
            email,
            asunto,
            mensaje,
            fecha: new Date().toLocaleString()
        };

        // Guardar la consulta en localStorage (opcional pero le suma dinamismo)
        let consultasGuardadas = JSON.parse(localStorage.getItem("consultas_contacto")) || [];
        consultasGuardadas.push(nuevaConsulta);
        localStorage.setItem("consultas_contacto", JSON.stringify(consultasGuardadas));

        // Feedback interactivo con SweetAlert2
        Swal.fire({
            title: `¡Gracias por tu mensaje, ${nombre}! 🌊`,
            text: `Hemos recibido tu consulta sobre "${asunto}". Te responderemos a la brevedad al correo ${email}.`,
            icon: "success",
            confirmButtonColor: "#0dcaf0",
            confirmButtonText: "Genial"
        });

        // Resetear el formulario tras el envío
        formContacto.reset();
    });
}