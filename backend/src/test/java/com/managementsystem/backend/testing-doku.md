# Durchführen der Integrationstests
1. Prüfen, ob eine JDK installiert ist. Wenn nicht, z.B. über den Befehl "brew install --cask temurin" im Terminal installieren
2. Den Ordner "projekt-und-aufgabenmanagementsystem/backend" im Terminal öffnen
3. Mit "./mvnw test" können alle Tests im Terminal ausgeführt werden. Mit "mvn test -Dtest=KlassenNameDesTests", kann ein spezieller Test ausgeführt werden.