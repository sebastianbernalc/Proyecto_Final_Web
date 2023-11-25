package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"project_final/models"
	repository "project_final/repository"
	"strings"
)

var (
	updateQuery = "UPDATE jugadores SET %s WHERE id=:id;"
	deleteQuery = "DELETE FROM jugadores WHERE id=$1;"
	selectQuery = "SELECT id, nombre, edad, altura, nacionalidad, club, posicion, goles FROM jugadores WHERE id=$1;"
	listQuery   = "SELECT id, nombre, edad, altura, nacionalidad, club, posicion, goles FROM jugadores limit $1 offset $2"
	createQuery = "INSERT INTO jugadores (nombre, edad, altura, nacionalidad, club, posicion, goles) VALUES (:nombre, :edad, :altura, :nacionalidad, :club, :posicion, :goles) RETURNING id;"
)

type Controller struct {
	repo repository.Repository[models.Jugador]
}

func NewController(repo repository.Repository[models.Jugador]) (*Controller, error) {
	if repo == nil {
		return nil, fmt.Errorf("para instanciar un controlador se necesita un repositorio no nulo")
	}
	return &Controller{
		repo: repo,
	}, nil
}

func (c *Controller) ActualizarJugador(reqBody []byte, id string) error {
	nuevosValoresJugador := make(map[string]any)
	err := json.Unmarshal(reqBody, &nuevosValoresJugador)
	if err != nil {
		log.Printf("fallo al actualizar un jugador, con error: %s", err.Error())
		return fmt.Errorf("fallo al actualizar un jugador, con error: %s", err.Error())
	}

	if len(nuevosValoresJugador) == 0 {
		log.Printf("fallo al actualizar un jugador, con error: %s", err.Error())
		return fmt.Errorf("fallo al actualizar un jugador, con error: %s", err.Error())
	}

	query := construirUpdateQuery(nuevosValoresJugador)
	nuevosValoresJugador["id"] = id
	err = c.repo.Update(context.TODO(), query, nuevosValoresJugador)
	if err != nil {
		log.Printf("fallo al actualizar un jugador, con error: %s", err.Error())
		return fmt.Errorf("fallo al actualizar un jugador, con error: %s", err.Error())
	}
	return nil
}

func construirUpdateQuery(nuevosValores map[string]any) string {
	columns := []string{}
	for key := range nuevosValores {
		columns = append(columns, fmt.Sprintf("%s=:%s", key, key))
	}
	columnsString := strings.Join(columns, ",")
	return fmt.Sprintf(updateQuery, columnsString)
}

func (c *Controller) LeerJugador(id string) ([]byte, error) {
	jugador, err := c.repo.Read(context.TODO(), selectQuery, id)
	if err != nil {
		log.Printf("fallo al leer un jugador, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un jugador, con error: %s", err.Error())
	}

	jugadorJson, err := json.Marshal(jugador)
	if err != nil {
		log.Printf("fallo al leer un jugador, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer un jugador, con error: %s", err.Error())
	}
	return jugadorJson, nil
}

func (c *Controller) EliminarJugador(id string) error {
	err := c.repo.Delete(context.TODO(), deleteQuery, id)
	if err != nil {
		log.Printf("fallo al eliminar un jugador, con error: %s", err.Error())
		return fmt.Errorf("fallo al eliminar un jugador, con error: %s", err.Error())
	}
	return nil
}

func (c *Controller) LeerJugadores(limit, offset int) ([]byte, error) {
	jugadores, _, err := c.repo.List(context.TODO(), listQuery, limit, offset)
	if err != nil {
		log.Printf("fallo al leer jugadores, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer jugadores, con error: %s", err.Error())
	}

	jsonJugadores, err := json.Marshal(jugadores)
	if err != nil {
		log.Printf("fallo al leer jugadores, con error: %s", err.Error())
		return nil, fmt.Errorf("fallo al leer jugadores, con error: %s", err.Error())
	}
	return jsonJugadores, nil
}

func (c *Controller) CrearJugador(reqBody []byte) (int64, error) {
	nuevoJugador := &models.Jugador{}
	err := json.Unmarshal(reqBody, nuevoJugador)
	if err != nil {
		log.Printf("fallo al crear un nuevo jugador, con error: %s", err.Error())
		return 0, fmt.Errorf("fallo al crear un nuevo jugador, con error: %s", err.Error())
	}
	valoresNuevosColumnasNuevoJugador := map[string]any{

		"nombre":       nuevoJugador.Nombre,
		"edad":         nuevoJugador.Edad,
		"altura":       nuevoJugador.Altura,
		"nacionalidad": nuevoJugador.Nacionalidad,
		"club":         nuevoJugador.Club,
		"posicion":     nuevoJugador.Posicion,
		"goles":        nuevoJugador.Goles,
	}
	nuevoId, err := c.repo.Create(context.TODO(), createQuery, valoresNuevosColumnasNuevoJugador)
	if err != nil {
		log.Printf("fallo al crear un nuevo jugador, con error: %s", err.Error())
		return 0, fmt.Errorf("fallo al crear un nuevo jugador, con error: %s", err.Error())
	}
	return nuevoId, nil
}
