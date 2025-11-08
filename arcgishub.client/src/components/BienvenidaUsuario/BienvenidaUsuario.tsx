interface MiPaginaBienvenidaProps {
    title: string;
}

function MiTitulo({ title }: MiPaginaBienvenidaProps) {
    return (
        <h1>{ title }</h1>
    )
}

export default function BienvenidaUsuario() {
  return (
      <MiTitulo title="Bienvenido Usuario" />
  );
}

