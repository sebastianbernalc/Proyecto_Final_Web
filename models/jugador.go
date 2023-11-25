package models

type Jugador struct {
	Id           uint64  `db:"id" json:"id"`
	Nombre       string  `db:"nombre" json:"nombre"`
	Edad         uint    `db:"edad" json:"edad"`
	Altura       float32 `db:"altura" json:"altura"`
	Nacionalidad string  `db:"nacionalidad" json:"nacionalidad"`
	Club         string  `db:"club" json:"club"`
	Posicion     string  `db:"posicion" json:"posicion"`
	Goles        uint    `db:"goles" json:"goles"`
}
