import React from "react";



const PrivacyPolicyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400">
            Politique de Confidentialité
          </h1>
          <p className="mt-2 text-sm text-gray-300">
        Mis à jour le{" "}
            <time dateTime="2025-08-28">28 août 2025</time>
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
   
        <nav aria-label="Sommaire" className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800">
          <h2 className="font-semibold text-yellow-300 mb-3">Sommaire</h2>
          <ul className="list-disc list-inside grid md:grid-cols-2 gap-y-1 text-gray-200">
            <li><a className="hover:underline" href="#responsable">Responsable du traitement</a></li>
            <li><a className="hover:underline" href="#donnees">Données collectées</a></li>
            <li><a className="hover:underline" href="#finalites">Finalités & bases légales</a></li>
            <li><a className="hover:underline" href="#conservation">Durées de conservation</a></li>
            <li><a className="hover:underline" href="#securite">Sécurité</a></li>
            <li><a className="hover:underline" href="#droits">Vos droits</a></li>
            <li><a className="hover:underline" href="#cookies">Cookies</a></li>
            <li><a className="hover:underline" href="#mineurs">Utilisateurs mineurs</a></li>
            <li><a className="hover:underline" href="#maj">Mises à jour</a></li>
            <li><a className="hover:underline" href="#contact">Contact</a></li>
          </ul>
        </nav>

    
        <section id="responsable" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">1) Responsable du traitement</h2>
          <p className="mt-3">
            Le responsable du traitement de vos données personnelles est :
          </p>
          <ul className="list-disc list-inside mt-2">
            <li><span className="font-semibold">Nom légal :</span> Trules Doniphane</li>
            <li><span className="font-semibold">Adresse :</span> Plate Saint-Leu</li>
            <li><span className="font-semibold">Email :</span>  <a className="underline" href="mailto:trulesdoniphane2@gmail.com">trulesdoniphane2@gmail.com</a></li>
          </ul>
        </section>
        <section id="donnees" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">2) Données collectées</h2>
          <p className="mt-3">Dans le cadre de l’utilisation de notre plateforme de quiz, nous pouvons collecter :</p>
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Données d’identification</h3>
              <ul className="list-disc list-inside">
                <li>Nom, prénom</li>
                <li>Adresse e-mail</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Données d’usage</h3>
              <ul className="list-disc list-inside">
                <li>Résultats et progrès aux quiz</li>
                <li>Journaux techniques (logs) et adresses IP</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Le caractère obligatoire des données est indiqué lors de la collecte. À défaut, certains services peuvent être indisponibles.
          </p>
        </section>


        {/* Durées de conservation */}
        <section id="conservation" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">4) Durées de conservation</h2>
          <p className="mt-3">Nous conservons vos données pendant des durées limitées et proportionnées :</p>
          <div className="overflow-x-auto mt-3">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-gray-200">
                <tr>
                  <th className="text-left p-3">Catégorie</th>
                  <th className="text-left p-3">Durée</th>
                  <th className="text-left p-3">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="p-3">Données de compte</td>
                  <td className="p-3">Pendant l’utilisation +  12 mois après la dernière activité</td>
                  <td className="p-3">Gestion du compte </td>
                </tr>
                <tr>
                  <td className="p-3">Résultats aux quiz</td>
                  <td className="p-3"> 12 mois</td>
                  <td className="p-3">Historique pédagogique </td>
                </tr>
                <tr>
                  <td className="p-3">Logs & sécurité</td>
                  <td className="p-3"> 6 à 12 mois</td>
                  <td className="p-3">Sécurité</td>
                </tr>
              
              </tbody>
            </table>
          </div>
        </section>
        <section id="securite" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">7) Sécurité</h2>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Mots de passe hachés et salés .</li>
            <li>Chiffrement en transit (HTTPS).</li>
          </ul>
          <p className="mt-3 text-sm text-gray-300">
            En cas de violation susceptible d’engendrer un risque élevé pour vos droits et libertés, vous serez informé conformément aux articles 33 et 34 du RGPD.
          </p>
        </section>

        {/* Droits */}
        <section id="droits" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">8) Vos droits</h2>
          <p className="mt-3">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Droit d’accès, de rectification, d’effacement.</li>
            <li>Droit à la limitation et à l’opposition.</li>
            <li>Droit à la portabilité des données fournies.</li>
            <li>Droit de retirer votre consentement à tout moment.</li>
            <li>Droit d’introduire une réclamation auprès de l’autorité de contrôle compétente (ex. CNIL).</li>
          </ul>
          <p className="mt-3">
            Pour exercer vos droits : envoyez un e-mail à {" "}
            <a className="underline" href="mailto:trulesdoniphane2@gmail.com">trulesdoniphane2@gmail.com</a> en précisant votre identité et l’objet de votre demande.
          </p>
        </section>

     
        <section id="cookies" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">9) Cookies & traceurs</h2>
          <p className="mt-3">
            Nous utilisons des cookies nécessaires au fonctionnement du site (authentification).  Vous pouvez modifier vos choix à tout moment depuis le lien “Gérer mes cookies”.
          </p>
        </section>

        <section id="maj" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">11) Mises à jour de cette politique</h2>
          <p className="mt-3">
            Cette politique peut évoluer. Toute modification substantielle sera notifiée sur cette page et/ou par e-mail si nécessaire. Veuillez la consulter régulièrement.
          </p>
        </section>

        <section id="contact" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">12) Contact</h2>
          <p className="mt-3">
            Pour toute question sur cette politique ou vos données personnelles, écrivez-nous à {" "}
            <a className="underline" href="mailto:trulesdoniphane2@gmail.com">trulesdoniphane2@gmail.com</a>.
          </p>
        </section>

        <footer className="text-xs text-gray-400">
          © {new Date().getFullYear()} Votre Société. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
