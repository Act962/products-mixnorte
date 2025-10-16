import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const sighUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type SignUpForm = z.infer<typeof sighUpSchema>;

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(sighUpSchema),
  });

  async function handleSigUp(data: SignUpForm) {
    console.log(data);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Cadastro de Cliente
          </h1>
          <p className="text-muted-foreground mb-6">
            Preencha seus dados para finalizar o pedido
          </p>

          <form onSubmit={handleSubmit(handleSigUp)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                type="text"
                {...register("address")}
                placeholder="Rua, número, complemento"
              />
            </div>

            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                type="text"
                {...register("city")}
                placeholder="Sua cidade"
              />
            </div>

            <Button type="submit" className="w-full">
              Cadastrar e Continuar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
