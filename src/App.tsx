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
    command: () => `npm install -D tailwindcss postcss autoprefixer`,
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
        './src/**/*.{js,jsx,ts,tsx}', 
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
];
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
    </div>
  );
};

export default App;
