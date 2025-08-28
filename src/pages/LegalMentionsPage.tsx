import React from "react";

const LegalMentionsPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
   
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400">
            Mentions Légales
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la
            Confiance dans l'économie numérique (LCEN).
          </p>
        </div>
      </header>


      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
 
        <nav aria-label="Sommaire" className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800">
          <h2 className="font-semibold text-yellow-300 mb-3">Sommaire</h2>
          <ul className="list-disc list-inside grid md:grid-cols-2 gap-y-1 text-gray-200">
            <li><a className="hover:underline" href="#editeur">Éditeur du site</a></li>
            <li><a className="hover:underline" href="#hebergeur">Hébergement</a></li>
            <li><a className="hover:underline" href="#propriete">Propriété intellectuelle</a></li>
            <li><a className="hover:underline" href="#responsabilite">Responsabilité</a></li>
            <li><a className="hover:underline" href="#contact">Contact</a></li>
          </ul>
        </nav>

  
        <section id="editeur" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">1) Éditeur du site</h2>
          <ul className="list-disc list-inside mt-3 space-y-1">
            <li><span className="font-semibold">Nom de l'entreprise :</span> Acadyo Quizz</li>
            <li><span className="font-semibold">Adresse :</span> 26 bis chemin Pierre Roger Plate Saint Leu</li>
            <li><span className="font-semibold">Email :</span> trulesdoniphane2@gmail.com</li>
            <li><span className="font-semibold">Directeur de publication :</span> Trules Doniphane</li>
          </ul>
        </section>

 
        <section id="hebergeur" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">2) Hébergement</h2>
          <p className="mt-3">
            Le site est hébergé par :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><span className="font-semibold">Hébergeur :</span> Hostinger</li>
            <li><span className="font-semibold">Adresse :</span> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</li>
            <li><span className="font-semibold">Site web :</span>{" "}
              <a href="https://www.hostinger.com" className="text-blue-400 hover:text-blue-600">
                www.hostinger.com
              </a>
            </li>
          </ul>
        </section>


        <section id="propriete" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">3) Propriété intellectuelle</h2>
          <p className="mt-3">
            Tous les contenus présents sur ce site (textes, images, logos, etc.) sont protégés par le droit d'auteur
            et les droits de propriété intellectuelle. Toute reproduction, distribution, modification ou utilisation
            sans autorisation préalable est strictement interdite.
          </p>
        </section>


        <section id="responsabilite" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">4) Responsabilité</h2>
          <p className="mt-3">
            L'éditeur du site ne peut être tenu responsable :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site.</li>
            <li>Des erreurs ou omissions dans le contenu publié.</li>
            <li>Des interruptions de service liées à la maintenance ou à un cas de force majeure.</li>
          </ul>
        </section>

   
        <section id="contact" className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-300">5) Contact</h2>
          <p className="mt-3">
            Pour toute question ou demande d'information, vous pouvez nous contacter à l'adresse suivante :{" "}
            <a href="mailto:contact@acadyoquizz.com" className="underline">
              contact@acadyoquizz.com
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

export default LegalMentionsPage;
