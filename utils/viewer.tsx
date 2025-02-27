import { AuthToken } from "forge-apis";

export function initViewer(container: HTMLElement, token: AuthToken) {
  return new Promise(function (resolve, reject) {
    Autodesk.Viewing.Initializer(
      { env: "AutodeskProduction", accessToken: token.access_token },
      async () => {
        const config = {
          extensions: ["Autodesk.DocumentBrowser"],
        };
        const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
        viewer.start();
        viewer.setTheme("light-theme");
        resolve(viewer);
      }
    );
  });
}

export function loadModel(viewer: Autodesk.Viewing.GuiViewer3D, urn: string) {
  return new Promise(function (resolve, reject) {
    function onDocumentLoadSuccess(doc: any) {
      resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
    }
    function onDocumentLoadFailure(code: any, message: any, errors: any) {
      reject({ code, message, errors });
    }

    Autodesk.Viewing.Document.load(
      urn.startsWith("urn") ? urn : "urn:" + urn,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
  });
}

export const getIdsByProperty = async (
  viewer: Autodesk.Viewing.GuiViewer3D | Autodesk.Viewing.Viewer3D,
  property: string,
  values: any[]
) => {
  return (await viewer.model.getPropertyDb().executeUserFunction(
    function userFunction(pdb: any, tag: { property: string; values: any[] }) {
      if (tag.values.length === 0) return [];
      let result: number[] = [];
      var attrIdMass = -1;

      //console.log(tag.property, tag.values);

      pdb.enumAttributes(function (
        i: number,
        attrDef: { name: any },
        attrRaw: any
      ) {
        var name = attrDef.name;

        if (name === tag.property) {
          attrIdMass = i;
          return true;
        }
      });

      if (attrIdMass === -1) return null;

      pdb.enumObjects(function (dbId: number) {
        pdb.enumObjectProperties(dbId, function (attrId: number, valId: any) {
          if (attrId === attrIdMass) {
            var value = pdb.getAttrValue(attrId, valId);

            const values = tag.values[0];
            if (Array.isArray(values)) {
              if (values?.some((v) => v === value)) result.push(dbId);
            } else {
              if (tag.values.map((v) => String(v)).includes(String(value))) {
                result.push(dbId);
              }
            }

              //console.log(dbId, value, values);

            return true;
          }
        });
      });

      return result;
    },
    { property, values }
  )) as number[];
};
