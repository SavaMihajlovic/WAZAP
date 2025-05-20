# WAZAP
Wazap je web aplikacija rađena u c# .netu i reactjs kao bazu koristi oracle server korišćen kroz EntityFramework. Aplikacija nudi:

- Prijava i odjava.
- Zaboravljena lozinka
- Kupači mogu kupovati mesečne/polumesečne karte sa paypalom kao i rezervisati ležaljke za odreženi dan.
- Postoji mogućnost prijavljivanja na sezonski posao na bazenu
- Obrada zahteva kupača i radnika
# Uputstvo za pokretanje
- Backend se pokreće tako sto otvorite terminal u backend folder u ukucate sledeću komandu : dotnet run (ili dotnet watch run ako želite pristup swaggeru)
- Frontend se pokreće tako što otvorite terminal u frontend folder u ukucate sledeće komande ovim redosledom :npm install , npm audit fix (ove dve komande samo prvog puta) i na kraju npm run dev , za pokretanje samog frontenda.
# Podaci
Imate pristup sledećim sample podacima admin oracle : username : Aca password : acalukas1
swimmer oracle : username : Kupac password : kupac123

worker oracle : username : Radnik password : Radnik123

Za simulaciju plaćanja putem paypala koristite sledeći nalog : gmail : sb-qbg43i33181803@personal.example.com password : NVU,2bi-
