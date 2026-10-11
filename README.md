# projekt-und-aufgabenmanagementsystem
Projekt- und Aufgabenmanagementsystem für ein IT-Dienstleistungsunternehmen

## Starten des Backends und des Frontends
1. Backend starten: Im Ordner 'bin' befindet sich eine Datei "start-backend", welche bei Ausführung das Backend über den Terminal startet
2. Frontend starten: Analog zum backend, gibt es im bin-Ordner auch eine Datei "start-frontend", welche das Frontend ebenso im Terminal starten lässt

## Übersicht der Rollen-Berechtigungen in Mane
- **AdminAccess:** (Impliziert alle nachfolgenden Rechte) Vollzugriff auf alle Funktionen und Daten des Systems.
- **CustomerPageAccess:** Der Nutzer hat Zugriff auf die Kunden-Übersichts-Seite und kann neue Kunden und Ansprechpartner anlegen, sowie bestehende bearbeiten.
- **AllProjectsAccess:** (Impliziert alle nachfolgenden Rechte) Zugriff auf alle Projekte (dürfen alle bearbeitet und neue erstellt werden), aber kein Zugang zur Admin-Oberfläche und den zugehörigen Funktionen wie Benutzer- & Rollenverwaltung. Ist einem User diese Rolle nicht zugeordnet, sieht er autom. nur die Projekte, die ihm zugeordnet sind
- **CreateProjectsAccess:** (Impliziert alle nachfolgenden Rechte) Selben Admin-Einschränkungen wie für AllProjectsAccess, jedoch gilt diese Berechtigungen v.a. denen, die neue Projekte anlegen dürfen, aber keine Einsicht in alle Projekte haben (nur die, die ihnen zugeteilt wurden)
- **EditAvailableProjectsAccess:** (Impliziert alle nachfolgenden Rechte) Selben Admin-Einschränkungen wie für AllProjectsAccess. Personen haben hier die Möglichkeit die Projekte, die sie einsehen dürfen, zu bearbeiten
- **CreateAndEditTasksAccess:** Selben Admin-Einschränkungen wie für AllProjectsAccess. Personen haben hier die Möglichkeit, Aufgaben zu erstellen und zu bearbeiten, von dem Projekt, dem sie zugeordnet sind