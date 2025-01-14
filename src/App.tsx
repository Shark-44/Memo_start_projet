import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Copy } from 'lucide-react';
import { Alert } from './components/ui/alert';

const commands = [
  {
    id: "createViteProject",
    label: "Créer un projet React TypeScript avec Tailwind",
    command: (name: string) =>
      `npm create vite@latest ${name || "mon-projet"} -- --template react-ts`,
  },
  {
    id: "initProject",
    label: "Entrer dans le projet et initialiser",
    command: (name: string) => `cd ${name || "mon-projet"}\nnpm install`,
  },
  {
    id: "installTailwind",
    label: "Installer Tailwind CSS",
    command: () => `npm install -D tailwindcss postcss autoprefixer prettier eslint-config-prettier eslint-plugin-react`,
  },
  {
    id: "initTailwind",
    label: "Initialiser Tailwind",
    command: () => `npx tailwindcss init -p`,
  },
  {
    id: "configTailwind",
    label: "Modifier le fichier tailwind.config.js ",
    command: () => `/** @type {import('tailwindcss').Config} */\nmodule.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", 
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }`,
  },
  {
    id: "indexCss",
    label: "Remplacer index.css",
    command: () => `@tailwind base;\n@tailwind components;\n@tailwind utilities;
    `,
  },
  {
    id: "EsLintPrettier",
    label: "Ajout fichier Eslint/Prettier",
    command: () => `touch .eslintrc.js .prettierrc
    `,
  },
  {
    id: "Eslint",
    label: "Fichier config pour Eslint",
    command: () => `
    /*.eslintrc.js*/
    module.exports = {
      env: {
        browser: true,
        es2021: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime', // Ajout pour React 18+
        'plugin:react-hooks/recommended', // Ajout explicite des hooks rules
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest', // Plus moderne que 12
        sourceType: 'module',
      },
      plugins: ['react', '@typescript-eslint', 'react-hooks'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error', // Vérifie les règles des Hooks
        'react-hooks/exhaustive-deps': 'warn', // Vérifie les dépendances des effets
        'react/prop-types': 'off', // Off car vous utilisez TypeScript
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    };
    `,
  },
  {
    id: "Prettier",
    label: "Fichier config Prettier",
    command: () => `{
      "semi": true,
      "tabWidth": 2,
      "printWidth": 100,
      "singleQuote": true,
      "trailingComma": "all",
      "jsxSingleQuote": true,
      "bracketSpacing": true
    }
    `,
  },
];
const commandshad = [
  {
    id: "modifer",
    label: "Modifier tsconfig.json ",
    command: (name: string) =>
      `{
        "files": [],
        "references": [
          {
            "path": "./tsconfig.app.json"
          },
          {
            "path": "./tsconfig.node.json"
          }
        ],
        "compilerOptions": {
          "baseUrl": ".",
          "paths": {
            "@/*": ["./src/*"]
          }
        }
      }
      `,
  },
  {
    id: "editer",
    label: "Et ensuite le fichier tsconfig.app.json ",
    command: (name: string) =>
      `{
        "compilerOptions": {
          // ...
          "baseUrl": ".",
          "paths": {
            "@/*": [
              "./src/*"
            ]
          }
          // ...
        }
      }      
      `,
  },
  {
    id: "ajout",
    label: "Installer ",
    command: (name: string) =>
      `npm install -D @types/node`,
  },
  {
    id: "viteconfig",
    label: "Ajouter les lignes a vite.config.ts ",
    command: (name: string) =>
      `import path from "path"
      import react from "@vitejs/plugin-react"
      import { defineConfig } from "vite"
      
      export default defineConfig({
        plugins: [react()],
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src"),
          },
        },
      })          
      `,
  },
  {
    id: "installShadcn",
    label: "Installer shadcn ",
    command: (name: string) =>
      `npx shadcn@latest init`,
  },
  {
    id: "configShadcn",
    label: "configurer en répondant  ",
    command: (name: string) =>
      `Which style would you like to use? › New York
      Which color would you like to use as base color? › Zinc
      Do you want to use CSS variables for colors? › no / yes
      `,
  },
  {
    id: "buttonShadcn",
    label: "exemple pour ajouter un composant  ",
    command: (name: string) =>
      `npx shadcn@latest add button`,
  },
]

const tsconfig = `{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

  },
  "include": ["src"]
}`

const App = () => {
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState(""); 
  const [showValidation, setShowValidation] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 5000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tempName.trim() === "") {
      setShowValidation(true);
    } else {
      setShowValidation(false);
      setName(tempName); 
    }
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="projectName" className='text-xl'>Nom du projet :</Label>
          <Input
            id="projectName"
            type="text"
            value={tempName} 
            onChange={(e) => setTempName(e.target.value)} 
            className="w-full"
          />
          {showValidation && (
            <Alert variant="destructive">
              Veuillez entrer un nom pour le projet.
            </Alert>
          )}
        </div>
        <Button type="submit">Générer le nom du projet</Button>
      </form>

      {commands.map(({ id, label, command }) => (
        <Card key={id} className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative mt-4">
              <pre className="bg-slate-950 text-slate-50 rounded-lg p-4 overflow-x-auto">
                <code>{command(name)}</code>
              </pre>
              <Button
                size="icon"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => handleCopyToClipboard(command(name))}
              >
                <Copy
                  className={copiedText === command(name) ? "text-green-500" : ""}
                  size={16}
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Note :</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            2 fichiers tsconfig.app.json et tsconfig.node.json sont créés. On peut supprimer tsconfig.node.json pour une utilisation sans backend.
          </p>
          <p >tsconfig.json :</p>
          <div className="relative mt-4">
              <pre className="bg-slate-950 text-slate-50 rounded-lg p-4 overflow-x-auto">
                <code>{`{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" }\n  ]\n}`}</code>
              </pre>
              <Button
                size="icon"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => handleCopyToClipboard(`{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" }\n  ]\n}`)}
              >
                <Copy
                  className={copiedText === `{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" }\n  ]\n}` ? "text-green-500" : ""}
                  size={16}
                />
              </Button>
          </div>
          <p >tsconfig.app.json :</p>
          <div className="relative mt-4">
              <pre className="bg-slate-950 text-slate-50 rounded-lg p-4 overflow-x-auto">
                <code>{tsconfig}</code>
              </pre>
              <Button
                size="icon"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => handleCopyToClipboard(tsconfig)}
              >
                <Copy
                  className={copiedText === tsconfig ? "text-green-500" : ""}
                  size={16}
                />
              </Button>
            </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
          <CardTitle className='text-3xl'>shadcn/ui </CardTitle>
        </CardHeader>

      </Card>
      {commandshad.map(({ id, label, command }) => (
        <Card key={id} className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative mt-4">
              <pre className="bg-slate-950 text-slate-50 rounded-lg p-4 overflow-x-auto">
                <code>{command(name)}</code>
              </pre>
              <Button
                size="icon"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => handleCopyToClipboard(command(name))}
              >
                <Copy
                  className={copiedText === command(name) ? "text-green-500" : ""}
                  size={16}
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

    </div>
  );
};

export default App;
