/*
  The MeshFactory creates any Three.js mesh using basic JSON instructions
*/

import {
  BoxGeometry, CapsuleGeometry, CircleGeometry, ConeGeometry, CylinderGeometry,
  DodecahedronGeometry, EdgesGeometry, ExtrudeGeometry, IcosahedronGeometry,
  LatheGeometry, LineBasicMaterial, LineDashedMaterial, Material, Mesh, MeshBasicMaterial,
  MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial,
  MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
  MeshToonMaterial, OctahedronGeometry, PlaneGeometry, PointsMaterial, PolyhedronGeometry,
  RawShaderMaterial, RingGeometry, ShaderMaterial, ShadowMaterial, ShapeGeometry,
  SphereGeometry, SpriteMaterial, TetrahedronGeometry, TorusGeometry, TorusKnotGeometry,
  TubeGeometry, WireframeGeometry
} from 'three';

class MeshFactory {
  static create(options) {
    const geometry = new MeshFactory[options.geometry[0]](...options.geometry.slice(1));
    const material = new MeshFactory[options.material[0]](...options.material.slice(1));
    const mesh = new Mesh(geometry, material);
    return mesh;
  }

  // Assign all Three.js Mesh classes as static fields
  static BoxGeometry = BoxGeometry;
  static CapsuleGeometry = CapsuleGeometry;
  static CircleGeometry = CircleGeometry;
  static ConeGeometry = ConeGeometry;
  static CylinderGeometry = CylinderGeometry;
  static DodecahedronGeometry = DodecahedronGeometry;
  static EdgesGeometry = EdgesGeometry;
  static ExtrudeGeometry = ExtrudeGeometry;
  static IcosahedronGeometry = IcosahedronGeometry;
  static LatheGeometry = LatheGeometry;
  static LineBasicMaterial = LineBasicMaterial;
  static LineDashedMaterial = LineDashedMaterial;
  static Material = Material;
  static Mesh = Mesh;
  static MeshBasicMaterial = MeshBasicMaterial;
  static MeshDepthMaterial = MeshDepthMaterial;
  static MeshDistanceMaterial = MeshDistanceMaterial;
  static MeshLambertMaterial = MeshLambertMaterial;
  static MeshMatcapMaterial = MeshMatcapMaterial;
  static MeshNormalMaterial = MeshNormalMaterial;
  static MeshPhongMaterial = MeshPhongMaterial;
  static MeshPhysicalMaterial = MeshPhysicalMaterial;
  static MeshStandardMaterial = MeshStandardMaterial;
  static MeshToonMaterial = MeshToonMaterial;
  static OctahedronGeometry = OctahedronGeometry;
  static PlaneGeometry = PlaneGeometry;
  static PointsMaterial = PointsMaterial;
  static PolyhedronGeometry = PolyhedronGeometry;
  static RawShaderMaterial = RawShaderMaterial;
  static RingGeometry = RingGeometry;
  static ShaderMaterial = ShaderMaterial;
  static ShadowMaterial = ShadowMaterial;
  static ShapeGeometry = ShapeGeometry;
  static SphereGeometry = SphereGeometry;
  static SpriteMaterial = SpriteMaterial;
  static TetrahedronGeometry = TetrahedronGeometry;
  static TorusGeometry = TorusGeometry;
  static TorusKnotGeometry = TorusKnotGeometry;
  static TubeGeometry = TubeGeometry;
  static WireframeGeometry = WireframeGeometry;
}

export { MeshFactory }