package main

import (
	"log"
	"net/http"
	"project_final/controllers"
	"project_final/handlers"
	"project_final/models"
	repository "project_final/repository"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

func ConnectDB(url, driver string) (*sqlx.DB, error) {
	pgUrl, _ := pq.ParseURL(url)
	db, err := sqlx.Connect(driver, pgUrl)
	if err != nil {
		log.Printf("Fallo en conexion a PostgreeSQL, error: %s", err.Error())
		return nil, err
	}
	log.Printf("Conexion a PostgreeSQL exitosa a la base de datos: %#v", db)
	return db, nil
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	db, err := ConnectDB("postgres://vltskpct:M4fg1YNwCp96IzutWJYxWjgXp4rZ0oCo@berry.db.elephantsql.com/vltskpct", "postgres")
	if err != nil {
		log.Fatalf("Fallo en conexion a PostgreeSQL, error: %s", err.Error())
		return
	}

	repo, err := repository.NewRepository[models.Jugador](db)
	if err != nil {
		log.Fatalf("Fallo al crear una instancia al repositorio: %s", err.Error())
		return
	}

	controller, err := controllers.NewController(repo)
	if err != nil {
		log.Fatalf("Fallo al crear una instancia de controller: %s", err.Error())
		return
	}
	handler, err := handlers.NewHandler(controller)
	if err != nil {
		log.Fatalln("Fallo al crear una instancia de handler", err.Error())
		return
	}

	router := mux.NewRouter()

	// Manejador CORS para todas las rutas
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			enableCors(&w)
			next.ServeHTTP(w, r)
		})
	})

	router.Handle("/jugadores", http.HandlerFunc(handler.LeerJugadores)).Methods(http.MethodGet)
	router.Handle("/jugadores/{id}", http.HandlerFunc(handler.LeerJugador)).Methods(http.MethodGet)
	router.Handle("/jugadores", http.HandlerFunc(handler.CrearJugador)).Methods(http.MethodPost)
	router.Handle("/jugadores/{id}", http.HandlerFunc(handler.ActualizarJugador)).Methods(http.MethodPatch)
	router.Handle("/jugadores/{id}", http.HandlerFunc(handler.EliminarJugador)).Methods(http.MethodDelete)

	log.Fatal(http.ListenAndServe(":8080", router))
}
