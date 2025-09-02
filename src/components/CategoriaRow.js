import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiUsuario from "../services/usuarioApi";

export default function CategoriaRow({categoria}) {
   const [livros, setLivros] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [imagem, setImagens] = useState({})

  const itensPerPage = 1;

  useEffect(()=>{
    const fetchLivros = async ()=>{
    try{
        const response = await apiUsuario.get("categoria/livrosPagination?page="+page)
        const livrosData = response.data.content
        setLivros(livrosData)
        setTotalPages(response.data.totalPages)
        livrosData.forEach(async(livro) => {
            const res = await apiUsuario.get( `livro/capa/${encodeURIComponent(livro.titulo)}`,
            { responseType: "blob" })

            const url =  URL.createObjectURL(res.data);
            setImagens((prev) => ({ ...prev, [livro.id]: url }));
        });
    }catch(err){
        console.error("Erro ao buscar livro: ", err);
    }
    }

    fetchLivros();
  },[page])

   const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };
  
return (
  <div className="mb-10">
    <h2 className="text-xl font-bold mb-3">{categoria.nome}</h2>

    <div className="relative w-full max-w-4xl mx-auto"> {/* carrossel centralizado e mais largo */}
      
      {/* Botão esquerda */}
      <button
        onClick={prevPage}
        disabled={page === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow disabled:opacity-50 z-10"
      >
        <ChevronLeft />
      </button>

      {/* Container dos cards */}
      <div className="flex justify-center">
        {livros.map((livro) => (
          <div key={livro.id} className="w-40 flex-shrink-0 flex flex-col items-center mx-2">
            <div className="w-40 h-56 overflow-hidden rounded-lg shadow">
              <img
                src={imagem[livro.id]}
                alt={livro.titulo}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="mt-2 text-sm text-center truncate">{livro.titulo}</p>
          </div>
        ))}
      </div>

      {/* Botão direita */}
      <button
        onClick={nextPage}
        disabled={page === totalPages - 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow disabled:opacity-50 z-10"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
);

}
