package main

import (
    "log"
    "net/http"
    "MIS-Analytics-service/controller"
)

func main() {
    log.Println("Registering /api/data")
    http.HandleFunc("/api/data", GoServer.GetAllData)
    
    log.Println("Registering /api/data/update")
    http.HandleFunc("/api/data/update", GoServer.UpdateData)
    
    log.Println("Starting server on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))

}
