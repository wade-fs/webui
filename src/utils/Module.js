import { apiAddModule } from "api";

export async function addModules(terminalId, modules) {
  let ids = [];
  for await (const module of modules) {
    if (module != null) {
      const response = await apiAddModule(terminalId, module);
      if (response.result === false) {
        const errorMsg = response.data;
        throw Error(errorMsg);
      }
      ids.push(newId);
    }
  }
  return ids.join(",");
}
