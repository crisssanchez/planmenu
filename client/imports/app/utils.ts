/*Función recursiva que convierte
un array de array en un sarray simple*/

export function flat (r,a){
  if(Array.isArray(a)){
    return a.reduce(flat,r);
  }
  r.push(a);
  return r;
}
