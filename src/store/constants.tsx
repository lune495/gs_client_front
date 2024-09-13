export const DOCTEUR_URL=`graphql?query={medecins{nom,prenom,id,module{nom,id}}}`
export const CLIENT_URL=`graphql?query={clients{nom_complet,solde,telephone,id,adresse}}`
export const TRANSACTION_URL=`graphql?query={transactions{id debit credit solde client{nom_complet,telephone,id,adresse}}}`

