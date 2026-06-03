# projekt-und-aufgabenmanagementsystem
Projekt- und Aufgabenmanagementsystem für ein IT-Dienstleistungsunternehmen


## Rollen-Berechtigungen
- **AdminAccess:** (Impliziert alle nachfolgenden Rechte) Vollzugriff auf alle Funktionen und Daten des Systems.
- **CustomerPageAccess:** Der Nutzer hat Zugriff auf die Kunden-Übersichts-Seite und kann neue Kunden und Ansprechpartner anlegen, sowie bestehende bearbeiten.
- **AllProjectsAccess:** (Impliziert alle nachfolgenden Rechte) Zugriff auf alle Projekte (dürfen alle bearbeitet und neue erstellt werden), aber kein Zugang zur Admin-Oberfläche und den zugehörigen Funktionen wie Benutzer- & Rollenverwaltung. Ist einem User diese Rolle nicht zugeordnet, sieht er autom. nur die Projekte, die ihm zugeordnet sind
- **CreateProjectsAccess:** (Impliziert alle nachfolgenden Rechte) Selben Admin-Einschränkungen wie für AllProjectsAccess, jedoch gilt diese Berechtigungen v.a. denen, die neue Projekte anlegen dürfen, aber keine Einsicht in alle Projekte haben (nur die, die ihnen zugeteilt wurden)
- **EditAvailableProjectsAccess:** (Impliziert alle nachfolgenden Rechte) Selben Admin-Einschränkungen wie für AllProjectsAccess. Personen haben hier die Möglichkeit die Projekte, die sie einsehen dürfen, zu bearbeiten
- **CreateAndEditTasksAccess:** Selben Admin-Einschränkungen wie für AllProjectsAccess. Personen haben hier die Möglichkeit, Aufgaben zu erstellen und zu bearbeiten, von dem Projekt, dem sie zugeordnet sind