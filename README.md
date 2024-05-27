<img src="https://github.com/Gagotlib/Advanced-Parking-Front/blob/main/advanced-parking/public/titleAdvancedParking.webp" alt="Title Advanced Parking" width="620" height="312" />

# Advanced Parking

## Meet the Brains

1. [Gotlib, Gabriel](https://www.linkedin.com/in/gabriel-gotlib-5855197b/) – Frontend
2. [Ibargüen Currea, Diego Sebastian](https://www.linkedin.com/in/sebastianibarguen/) - Frontend
3. [Salas Seeber, Simón](https://www.linkedin.com/in/sim%C3%B3n-salas-seeber-138112144/) - Backend
4. [Lencina, Marcelo Daniel](https://www.linkedin.com/in/mlmarce/) - Backend
5. [Coledani Grillo, Jose Salvador](https://www.linkedin.com/in/jose-salvador-coledani-grillo-10b857278/) - Backend
6. [Gutiérrez Tello, Mario Sebastián](https://www.linkedin.com/in/mario-gutierrez-tello/) - Backend

# App Usage Mode

<p>This project is created in order to simulate the process of parking establishment reservation, register, login and perform the requests of creating a reservation, payment simulator, editing profile information and so on.</p>

<h3>Installation</h3>.

- Clone the repository.
- Locate yourself in the path at the height of the **/back** folder and install the dependencies using _npm install_.
- Configure the environment variables, use the _.env.example_ file guide in the root of the **/back** folder.
- Upload the project from the _/back_ path using **npm start**.

- To upload the **Parking-lot** and its corresponding **Slots** to the database you have to execute two requests in the following order:
    - GET to /parking-lot/seeder
    - GET to /slot/seeder     

- To create an **Admin** user you must execute a request to the following path:
    - POST to /user/seeder 


# Modo de Uso App (en español)

<p>Este proyecto esta creado con el fin de simular el proceso de reserva de establicimiento de parqueo, registrar, iniciar sesión y realizar las peticiones de crear un reserva, simulador de pago, edición de información de perfil y muchas funcionalidades más.</p>

<h3>Instalación</h3>

- Clonar el repositorio.
- Ubicarte en la ruta a la altura de la carpeta **/back** e instalar las dependencias usando _npm install_.
- Configurar las variables de entorno, usa la guia del arhchivo _.env.example_ en la raiz de la carpeta **/back**.
- Levanta el proyecto desde la ruta _/back_ usado **npm start**.

- Para subir a la base de datos los **Parking-lot** y sus correspondientes **Slots** hay que ejecutar dos solicitudes en el siguiente orden:
    - GET a /parking-lot/seeder
    - GET a /slot/seeder     

- Para crear un usario **Admin** debes ejecutar una solicitud a la siguiente ruta:
    - POST a /user/seeder 