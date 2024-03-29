const Discord = require("discord.js");
const fs = require("fs"); // Librería para manejo de archivos

const client = new Discord.Client();

// Diccionario para almacenar el dinero
let dinero = {
    cash: 0,
    "washed cash": 0,
    "rolled cash": 0,
    "banded cash": 0
};

// Función para cargar datos del archivo (opcional)
function loadData() {
  try {
    const data = fs.readFileSync("dinero.json", "utf8");
    dinero = JSON.parse(data);
  } catch (error) {
    console.warn("No se encontró archivo de datos. Se creará uno nuevo.");
  }
}

// Función para guardar datos en el archivo (opcional)
function saveData() {
  fs.writeFileSync("dinero.json", JSON.stringify(dinero), "utf8");
}

// Función para añadir dinero
function addMoney(message, tipo, cantidad) {
    if (!dinero.hasOwnProperty(tipo)) {
        message.channel.send("Tipo de dinero no válido.");
        return;
    }
    try {
        cantidad = parseInt(cantidad);
    } catch (error) {
        message.channel.send("Cantidad no válida.");
        return;
    }
    if (cantidad <= 0) {
        message.channel.send("La cantidad debe ser mayor que 0.");
        return;
    }
    dinero[tipo] += cantidad;
    message.channel.send("Se ha añadido {cantidad} {tipo} a tu cuenta.");
    saveData(); // Guarda los datos actualizados (opcional)
}

// Función para sacar dinero
function removeMoney(message, tipo, cantidad) {
    if (!dinero.hasOwnProperty(tipo)) {
        message.channel.send("Tipo de dinero no válido.");
        return;
    }
    try {
        cantidad = parseInt(cantidad);
    } catch (error) {
        message.channel.send("Cantidad no válida.");
        return;
    }
    if (cantidad <= 0) {
        message.channel.send("La cantidad debe ser mayor que 0.");
        return;
    }
    if (dinero[tipo] < cantidad) {
        message.channel.send("No tienes suficiente dinero de ese tipo.");
        return;
    }
    dinero[tipo] -= cantidad;
    message.channel.send("Se ha retirado {cantidad} {tipo} de tu cuenta.");
    saveData(); // Guarda los datos actualizados (opcional)
}

// Función para mostrar el total de dinero
function showMoney(message) {
    for (const tipo in dinero) {
        message.channel.send(`${tipo}: ${dinero[tipo]}`);
    }
}

// Registrar eventos
client.on("ready", () => {
    console.log("El bot está listo.");
    loadData(); // Carga los datos del archivo al iniciar (opcional)
});

client.on("message", message => {
    if (message.content.startsWith("!")) {
        const args = message.content.slice(1).split(" ");
        const command = args.shift().toLowerCase();

        switch (command) {
            case "dinero":
                if (!args.length) {
                    showMoney(message);
                } else {
                    const subcommand = args.shift().toLowerCase();
                    const tipo = args[0];
                    const cantidad = args[1];

                    switch (subcommand) {
                        case "añadir":
                            addMoney(message, tipo, cantidad);
                            break;
                        case "sacar":
                            removeMoney(message, tipo, cantidad);
                            break;
                        default:
                            message.channel.send("Comando inválido. Usa `!dinero` para ver las opciones.");
                    }
                }
                break;
        }
    }
});

// Token del bot (reemplazar con tu token)
const token = "MTIyMzI0OTIxMDc5MTU1OTE3OQ.Gw1JNl.u4hBbdgbYJCtMu8s48-RJ74Kof8B5mrAG0rzgU";

client.login(token)
  .then(() => console.log("¡Bot iniciado!"))
  .catch(console.error);