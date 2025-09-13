// src/pages/AboutPage.tsx
import React from "react";
import Alex from "/src/assets/Alexnew.jpg";
import Artjom from "/src/assets/artjom.jpg";
import Vlad from "/src/assets/vlad.jpg";
import Nikita from "/src/assets/4ortebanij.png";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

const team: TeamMember[] = [
  {
    name: "Aleksei Kurõljov",
    role: "Designer, Pitcher",
    description:
      "// frontend, design, public speaking и чтонибудь еще. Пару предложений",
    image: Alex,
  },
  {
    name: "Vladislav Nesterenko",
    role: "Backend Beast",
    description:
      "// backend, Java, marketing и чтонибудь еще. Пару предложений",
    image: Vlad,
  },
  {
    name: "Artjom Kulikovski",
    role: "Mobile applications Expert",
    description:
      "// frontend, JavaScript, entrepreneurship и чтонибудь еще. Пару предложений",
    image: Artjom,
  },
  {
    name: "Alina",
    role: "Alina Designer и чтонибудь еще",
    description:
      "// Alina Designer и чтонибудь еще",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Nikita Strekalov",
    role: "Cybersecurity Paladin",
    description:
      "// backend, Golang, data analysis и чтонибудь еще. Пару предложений",
    image: Nikita,
  },
];

const TeamPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Наша команда</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {team.map((member) => (
          <div
            key={member.name}
            className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover mb-4"
              height='300px" width="300px'
            />
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-sm text-gray-500">{member.role}</p>
            <p className="text-center text-gray-700 mt-2">
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
