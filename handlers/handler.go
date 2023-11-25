package handlers

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"project_final/controllers"

	"github.com/gorilla/mux"
)

type Handler struct {
	controller *controllers.Controller
}

func NewHandler(controller *controllers.Controller) (*Handler, error) {
	if controller == nil {
		return nil, fmt.Errorf("para instanciar un handler se necesita un controlador no nulo")
	}
	return &Handler{
		controller: controller,
	}, nil
}

func (h *Handler) ActualizarJugador(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id := vars["id"]
	body, err := io.ReadAll(req.Body)
	if err != nil {
		log.Printf("fallo al actualizar un jugador, con error: %s", err.Error())
		http.Error(writer, fmt.Sprintf("fallo al actualizar un jugador, con error: %s", err.Error()), http.StatusBadRequest)
		return
	}
	defer req.Body.Close()

	err = h.controller.ActualizarJugador(body, id)
	if err != nil {
		log.Printf("fallo al actualizar un jugador, con error: %s", err.Error())
		http.Error(writer, fmt.Sprintf("fallo al actualizar un jugador, con error: %s", err.Error()), http.StatusInternalServerError)
		return
	}
	writer.WriteHeader(http.StatusOK)
}

func (h *Handler) EliminarJugador(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id := vars["id"]
	err := h.controller.EliminarJugador(id)
	if err != nil {
		log.Printf("fallo al eliminar un jugador, con error: %s", err.Error())
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte(fmt.Sprintf("fallo al eliminar un jugador con id %s", id)))
		return
	}
	writer.WriteHeader(http.StatusOK)
}

func (h *Handler) LeerJugador(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id := vars["id"]

	jugador, err := h.controller.LeerJugador(id)
	if err != nil {
		log.Printf("fallo al leer un jugador, con error: %s", err.Error())
		writer.WriteHeader(http.StatusNotFound)
		writer.Write([]byte(fmt.Sprintf("el jugador con id %s no se pudo encontrar", id)))
		return
	}
	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(jugador)
}

func (h *Handler) LeerJugadores(writer http.ResponseWriter, req *http.Request) {
	jugadores, err := h.controller.LeerJugadores(100, 0)
	if err != nil {
		log.Printf("fallo al leer jugadores, con error: %s", err.Error())
		http.Error(writer, "fallo al leer los jugadores", http.StatusInternalServerError)
		return
	}
	writer.WriteHeader(http.StatusOK)
	writer.Header().Set("Content-Type", "application/json")
	writer.Write(jugadores)
}

func (h *Handler) CrearJugador(writer http.ResponseWriter, req *http.Request) {
	body, err := io.ReadAll(req.Body)
	if err != nil {
		log.Printf("fallo al crear un nuevo jugador, con error: %s", err.Error())
		http.Error(writer, "fallo al crear un nuevo jugador", http.StatusBadRequest)
		return
	}
	defer req.Body.Close()

	nuevoId, err := h.controller.CrearJugador(body)
	if err != nil {
		log.Println("fallo al crear un nuevo jugador, con error:", err.Error())
		http.Error(writer, "fallo al crear un nuevo jugador", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusCreated)
	writer.Write([]byte(fmt.Sprintf("id nuevo jugador: %d", nuevoId)))
}
