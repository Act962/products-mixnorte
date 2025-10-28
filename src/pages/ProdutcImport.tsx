import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { client, SanityProduct } from "@/lib/sanity";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

type FieldMapping = {
  name: string;
  description: string;
  price: string;
  unit: string;
};

const ProductImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<FieldMapping>({
    name: "",
    description: "",
    price: "",
    unit: "",
  });
  const [step, setStep] = useState<
    "upload" | "map" | "preview" | "importing" | "done"
  >("upload");
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({ success: 0, failed: 0, errors: [] });
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError("");

    try {
      const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "csv") {
        Papa.parse(uploadedFile, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          delimitersToGuess: [",", "\t", "|", ";"],
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn("CSV parsing warnings:", results.errors);
            }

            // Limpar headers removendo espaços em branco
            const cleanHeaders = (results.meta.fields || []).map((h) =>
              h.trim()
            );
            setHeaders(cleanHeaders);
            setData(results.data as any[]);
            setStep("map");
          },
          error: (err) => {
            setError("Erro ao ler arquivo CSV: " + err.message);
          },
        });
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const reader = new FileReader();

        reader.onerror = () => {
          setError("Erro ao ler arquivo Excel");
        };

        reader.onload = (evt) => {
          try {
            const data = evt.target?.result;
            const wb = XLSX.read(data, { type: "array" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const jsonData = XLSX.utils.sheet_to_json(ws);

            if (jsonData.length > 0) {
              // Limpar headers removendo espaços em branco
              const cleanHeaders = Object.keys(jsonData[0] as object).map((h) =>
                h.trim()
              );
              setHeaders(cleanHeaders);
              setData(jsonData);
              setStep("map");
            } else {
              setError("Arquivo Excel está vazio");
            }
          } catch (err) {
            setError(
              "Erro ao processar arquivo Excel: " + (err as Error).message
            );
          }
        };

        reader.readAsArrayBuffer(uploadedFile);
      } else {
        setError("Formato de arquivo não suportado");
      }
    } catch (err) {
      setError("Erro ao processar arquivo: " + (err as Error).message);
      console.error(err);
    }
  };

  const generateSlug = (name: string): string => {
    if (!name) return "";
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImport = async () => {
    setStep("importing");
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      try {
        // Extrair valores e limpar espaços
        const productName = row[mapping.name]?.toString().trim();
        const priceStr = row[mapping.price]?.toString().trim();
        const productDescription = mapping.description
          ? row[mapping.description]?.toString().trim()
          : undefined;
        const productUnit = mapping.unit
          ? row[mapping.unit]?.toString().trim()
          : undefined;

        // Validações
        if (!productName) {
          errors.push(`Linha ${i + 1}: Nome do produto está vazio`);
          failedCount++;
          continue;
        }

        if (!priceStr) {
          errors.push(
            `Linha ${i + 1}: Preço está vazio para o produto "${productName}"`
          );
          failedCount++;
          continue;
        }

        // Converter preço - aceita vírgula e ponto como decimal
        const productPrice = parseFloat(priceStr.replace(",", "."));

        if (isNaN(productPrice) || productPrice < 0) {
          errors.push(
            `Linha ${
              i + 1
            }: Preço inválido (${priceStr}) para o produto "${productName}"`
          );
          failedCount++;
          continue;
        }

        // Criar produto
        const product: SanityProduct = {
          _type: "product",
          name: productName,
          slug: {
            _type: "slug",
            current: generateSlug(productName),
          },
          description: productDescription,
          price: productPrice,
          unit: productUnit,
          createdAt: new Date().toISOString(),
        };

        console.log(`Importando produto ${i + 1}/${data.length}:`, product);

        // Criar no Sanity
        await client.create(product);

        successCount++;
        console.log(`✓ Produto importado: ${productName}`);
      } catch (error: any) {
        const productName =
          row[mapping.name]?.toString().trim() || "desconhecido";
        const errorMsg = error?.message || "Erro desconhecido";

        console.error(`✗ Erro ao importar produto "${productName}":`, error);
        errors.push(`Linha ${i + 1} (${productName}): ${errorMsg}`);
        failedCount++;
      }
    }

    setImportResults({ success: successCount, failed: failedCount, errors });
    setStep("done");

    toast({
      title:
        importResults.failed === 0
          ? "Importação concluída com sucesso!"
          : "Importação concluída com erros",
      description: `${successCount} produtos importados. ${failedCount} falharam.`,
    });
  };

  const getMappedData = () => {
    return data.slice(0, 5).map((row) => ({
      name: row[mapping.name]?.toString().trim() || "",
      description: row[mapping.description]?.toString().trim() || "",
      price: row[mapping.price]?.toString().trim() || "",
      unit: row[mapping.unit]?.toString().trim() || "",
    }));
  };

  const isValidMapping = () => {
    return mapping.name && mapping.price;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-6xl mt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Importação de Produtos</h1>
          <p className="text-muted-foreground">
            Faça upload de um arquivo CSV ou XLSX para importar produtos
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </p>
          </div>
        )}

        {/* Upload Step */}
        {step === "upload" && (
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload do Arquivo
              </CardTitle>
              <CardDescription>
                Selecione um arquivo CSV ou XLSX contendo os dados dos produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileSpreadsheet className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">
                        Clique para fazer upload
                      </span>{" "}
                      ou arraste o arquivo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV, XLSX ou XLS
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mapping Step */}
        {step === "map" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Mapeamento de Colunas
              </CardTitle>
              <CardDescription>
                Selecione qual coluna do arquivo corresponde a cada campo do
                produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Nome <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={mapping.name}
                    onValueChange={(value) =>
                      setMapping({ ...mapping, name: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Preço <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={mapping.price}
                    onValueChange={(value) =>
                      setMapping({ ...mapping, price: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Select
                    value={mapping.description || "none"}
                    onValueChange={(value) =>
                      setMapping({
                        ...mapping,
                        description: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não mapear</SelectItem>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={mapping.unit || "none"}
                    onValueChange={(value) =>
                      setMapping({
                        ...mapping,
                        unit: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não mapear</SelectItem>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Voltar
                </Button>
                <Button
                  onClick={() => setStep("preview")}
                  disabled={!isValidMapping()}
                >
                  Continuar para Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Step */}
        {step === "preview" && (
          <Card>
            <CardHeader>
              <CardTitle>Preview dos Dados</CardTitle>
              <CardDescription>
                Confira os primeiros 5 produtos que serão importados. Total:{" "}
                {data.length} produtos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Unidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getMappedData().map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.description || "-"}</TableCell>
                        <TableCell>R$ {row.price}</TableCell>
                        <TableCell>{row.unit || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("map")}>
                  Voltar
                </Button>
                <Button onClick={handleImport}>
                  Importar {data.length} Produtos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Importing Step */}
        {step === "importing" && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Importando produtos...</p>
                <p className="text-sm text-muted-foreground">
                  Aguarde enquanto os dados são enviados ao Sanity
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Done Step */}
        {step === "done" && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                {importResults.failed === 0 ? (
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-yellow-500" />
                )}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Importação Concluída!</h3>
                  <div className="space-y-1">
                    <p className="text-lg">
                      <span className="text-green-500 font-semibold">
                        {importResults.success}
                      </span>{" "}
                      produtos importados com sucesso
                    </p>
                    {importResults.failed > 0 && (
                      <p className="text-lg">
                        <span className="text-destructive font-semibold">
                          {importResults.failed}
                        </span>{" "}
                        produtos falharam
                      </p>
                    )}
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div className="w-full max-w-2xl">
                    <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                        Ver detalhes dos erros ({importResults.errors.length})
                      </summary>
                      <ul className="space-y-1 text-sm text-red-700 max-h-60 overflow-y-auto">
                        {importResults.errors.map((error, idx) => (
                          <li key={idx} className="pl-4">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}

                <Button onClick={() => window.location.reload()}>
                  Importar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ProductImport;
