import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import ImageMapper from "./ImageMapper";
import DataUploader from "./DataUploader";
import * as XLSX from "xlsx";
//import axios from "axios"; // Asegúrate de instalar axios: npm install axios

export default function DespieceManager() {
  const [image, setImage] = useState(null);
  const [areas, setAreas] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [vinculados, setVinculados] = useState([]);
  const [excelData, setExcelData] = useState(null);
  const [headerData, setHeaderData] = useState({ A2: null, B2: null });

  const handleImageUpload = (img) => {
    setImage(URL.createObjectURL(img));
  };

  const handleAreaAdded = (newArea) => {
    setAreas([...areas, newArea]);
    const repuestoId = prompt("Ingrese el ID del repuesto:");
    if (repuestoId) {
      const nuevoRepuesto = {
        id: repuestoId,
        area: newArea,
        numero: areas.length + 1,
      };
      setRepuestos([...repuestos, nuevoRepuesto]);
      setVinculados([...vinculados, nuevoRepuesto.numero]);
    }
  };

  const handleDataUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (file) => {
      const data = new Uint8Array(file.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Extraer datos de A2 y B2
      const A2 = worksheet["A2"] ? worksheet["A2"].v : null;
      const B2 = worksheet["B2"] ? worksheet["B2"].v : null;
      console.log(A2, B2);
      setHeaderData({ A2, B2 });

      // Obtener el rango de celdas
      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      // Filtrar las columnas que no comienzan con 'A'
      const filteredCols = Object.keys(worksheet)
        .filter((key) => {
          if (key[0] === "!") return true; // Mantener las propiedades especiales
          const col = key.replace(/[0-9]/g, "");
          return col !== "A" && col !== "B";
        })
        .reduce((obj, key) => {
          obj[key] = worksheet[key];
          return obj;
        }, {});

      // Crear una nueva hoja de trabajo con las columnas filtradas
      const newWorksheet = {
        ...filteredCols,
        "!ref": XLSX.utils.encode_range({
          s: { c: 1, r: range.s.r }, // Comenzar desde la segunda columna
          e: { c: range.e.c, r: range.e.r },
        }),
      };

      const jsonData = XLSX.utils.sheet_to_json(newWorksheet, { header: 1 });
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };
  useEffect(() => {
    console.log("HeaderData actualizado:", headerData);
  }, [headerData]);
  // const handleProductSelect = (productCode) => {
  //   setSelectedProduct(productCode);
  // };

  return (
    <div className="flex flex-col gap-4 h-screen w-full">
      <h1 className="text-3xl">Gestor de Despieces</h1>
      <div className="flex justify-between h-3/4 w-full bg-red-700">
        {image ? (
          <ImageMapper
            imageSrc={image}
            onAreaAdded={handleAreaAdded}
            vinculados={vinculados}
          />
        ) : (
          <section className="flex flex-col gap-4 py-6 w-7/12 bg-green-700">
            <h2 className="text-2xl">Sube una imagen para comenzar a mapear</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
          </section>
        )}
        {excelData ? (
          <div className="flex flex-col items-center justify-between gap-4 py-6 w-5/12 bg-fuchsia-700">
            <div className="flex flex-col gap-6 overflow-y-auto w-full">
              <h2 className="text-2xl">Repuestos</h2>
              {headerData && (
                <h3>
                  <p>
                    {headerData.A2 !== null ? headerData.A2 : "No disponible"}{" "}
                    from{" "}
                    {headerData.B2 !== null ? headerData.B2 : "No disponible"}
                  </p>
                </h3>
              )}
              <table>
                <tbody>
                  {excelData.map((row, index) => (
                    <tr key={index}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="bg-red-900 hover:bg-red-950 w-fit px-10 py-1 rounded-md">
              Save
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-6 w-5/12 bg-blue-700">
            <h2 className="text-2xl">
              Sube los datos relacionados con este despiece
            </h2>
            <DataUploader onDataUpload={handleDataUpload} />
          </div>
        )}
      </div>
    </div>
  );
}

// const enviarAlBackend = async () => {
//   try {
//     const datosParaEnviar = {
//       imagen: image,
//       repuestos: repuestos.map((r) => ({
//         id: r.id,
//         numero: r.numero,
//         x: r.area.x,
//         y: r.area.y,
//         radius: r.area.radius,
//       })),
//     };

//     const response = await axios.post(
//       "/api/guardar-despiece",
//       datosParaEnviar
//     );
//     console.log("Datos enviados con éxito:", response.data);
//     alert("Despiece guardado correctamente");
//   } catch (error) {
//     console.error("Error al enviar datos:", error);
//     alert("Error al guardar el despiece");
//   }
// };
