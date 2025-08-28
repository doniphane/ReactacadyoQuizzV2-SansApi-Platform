import React from "react";

const CookiesPolicyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">

      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400">
            Politique de Cookies
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Cette politique explique l'utilisation des cookies et traceurs sur notre plateforme.
          </p>
        </div>
      </header>


      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        <nav aria-label="Sommaire" className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800">
          <h2 className="font-semibold text-yellow-300 mb-3">Sommaire</h2>
          <ul className="list-disc list-inside grid md:grid-cols-2 gap-y-1 text-gray-200">
            <li><a className="hover:underline" href="#definition">Qu’est-ce qu’un cookie ?</a></li>
            <li><a className="hover:underline" href="#types">Types de cookies utilisés</a></li>
            <li><a className="hover:underline" href="#gestion">Gestion des cookies</a></li>
            <li><a className="hover:underline" href="#conservation">Durée de conservation</a></li>
            <li><a className="hover:underline" href="#maj">Mises à jour</a></li>
            <li><a className="hover:underline" href="#contact">Contact</a></li>
          </ul>
        </nav>

  
        <section id="definition" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">1) Qu’est-ce qu’un cookie ?</h2>
          <p className="mt-3">
            Un cookie est un petit fichier texte enregistré sur votre appareil (ordinateur, smartphone, tablette)
            lorsque vous consultez un site web. Il permet de reconnaître votre navigateur et de mémoriser certaines
            informations.
          </p>
        </section>


        <section id="types" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">2) Types de cookies utilisés</h2>
          <p className="mt-3">Nous utilisons les catégories de cookies suivantes :</p>
          <ul className="list-disc list-inside mt-3 space-y-2">
            <li>
              <span className="font-semibold">Cookies strictement nécessaires :</span> indispensables au
              fonctionnement du site (authentification).
            </li>
          </ul>
        </section>

  
        <section id="gestion" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">3) Gestion des cookies</h2>
          <p className="mt-3">
            Lors de votre première visite, un bandeau vous permet d’accepter, refuser ou personnaliser le dépôt
            des cookies non essentiels. Vous pouvez modifier vos préférences à tout moment via le lien
            <span className="italic"> "Gérer mes cookies"</span> en bas de page.
          </p>
          <p className="mt-3">
            Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies.
            Attention : certains services peuvent ne pas fonctionner correctement sans cookies essentiels.
          </p>
        </section>

   
        <section id="conservation" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">4) Durée de conservation</h2>
          <p className="mt-3">
            La durée de vie d’un cookie varie selon sa finalité. En règle générale :
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li>Cookies de session : supprimés lorsque vous fermez votre navigateur.</li>
          </ul>
        </section>

  
        <section id="maj" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">5) Mises à jour de cette politique</h2>
          <p className="mt-3">
            Cette politique de cookies peut évoluer. Toute modification sera publiée sur cette page et, si
            nécessaire, signalée via un bandeau d’information lors de votre prochaine visite.
          </p>
        </section>

        <section id="contact" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">6) Contact</h2>
          <p className="mt-3">
            Pour toute question concernant l’utilisation des cookies, vous pouvez nous contacter à l’adresse :{" "}
            <a href="mailto:contact@acadyoquizz.com" className="underline">
             trulesdoniphane2@gmail.com
            </a>.
          </p>
        </section>

        <footer className="text-xs text-gray-400">
          © {new Date().getFullYear()} Acadyo Quizz. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
};

export default CookiesPolicyPage;
