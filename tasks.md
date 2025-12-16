## ✅ Priorités principales

- [x] Utiliser le **nom des fichiers `.json`** pour définir le nom des parcours
      ↳ Ignorer complètement les noms de parcours définis **à l’intérieur** des fichiers `.json`

- [ ] Augmenter le **timeout général à 1 minute**

- [ ] Accélérer la navigation **sans baisser la fiabilité**

- [ ] Améliorer la **fiabilité globale**

---

## 🐞 Bug critique à analyser

- [ ] Corriger le bug aléatoire où le script **se bloque au milieu d’un parcours**
      ↳ Impression qu’une commande est zappée
      ↳ Exemple : _radio bouton civilité MRH FQ_

- [ ] Analyser et comprendre **pourquoi ce problème arrive de manière aléatoire**
      (c’est le **seul problème bloquant** identifié)

---

## 📤 Exports & logs

- [x] Ajouter un **timestamp** dans l’export du **network**

- [x] Faire en sorte que la **console exporte aussi le contenu des objets** (pas seulement `[Object]`)

---

## ▶️ Exécution des scripts

- [ ] Pouvoir lancer **plusieurs scripts depuis un dossier** avec `*`
      Exemples :
    - `debug/*`
    - `dev-aep/*`

- [x] Améliorer les **messages console** :
    - [x] Lister la **commande en cours**
    - [x] Identifier clairement **quand une commande ne fonctionne pas**
    - [x] Supprimer le message `"skipped commande"`

- [x] Rendre **optionnel** `blockedUrls`

---

## 🖥️ Configuration navigateur

- [x] Définir comment **configurer la taille de l’écran**
      ↳ (viewport / window size)

- [x] Pouvoir contrôler si la **fenêtre se ferme ou non à la fin**
    - [x] Est-ce une option dans les `.json` ?
    - [ ] Ou une option au lancement du script ?

---

## 📂 Organisation des outputs

- [x] Changer l’organisation des outputs

- [x] Utiliser **un seul dossier `output/` pour tous les fichiers**

- [x] Nommer tous les fichiers avec le format :

    ```
    <type_output>_<nom_parcours>_<timestamp yymmdd-hhMMss>
    ```

    Exemple :

    ```
    network_auto-fq-ta-debug-dev_251205-100223
    ```

---

## ⚙️ Options & configuration avancée

- [ ] Lancer plusieurs tests **en parallèle**
    - [ ] Ne pas utiliser directement `suites.parallel`
    - [ ] Ajouter une **option dédiée au lancement des scripts**

- [x] Rendre **optionnelle** la propriété `target` pour les commandes `"script"`

- [x] Rendre **optionnelles** les propriétés suivantes :
    - [x] `name`
    - [x] `version`
    - [x] `suites.name`
    - [x] `suite.timeout`
    - [x] `suites.tests`
