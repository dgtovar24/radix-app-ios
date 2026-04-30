import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useThemeColors } from '../../theme/useThemeColor';
import { patientService, treatmentService, isotopeService, type Treatment, type Isotope } from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import StatusDot from '../../components/StatusDot';
import { ShieldIcon, ClockIcon } from '../../components/Icons';

function calc(s: string, d: number) { const t = new Date(s).getTime(); const e = t + d*86400000; const r = Math.max(0,e-Date.now()); return { days: Math.floor(r/86400000), hours: Math.floor((r%86400000)/3600000), elapsed: Math.floor((Date.now()-t)/86400000) }; }

export default function TreatmentScreen() {
  const colors = useThemeColors();
  const [t, setT] = useState<Treatment | null>(null);
  const [iso, setIso] = useState<Isotope | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const tok = await SecureStore.getItemAsync('auth_token'); if (!tok) return;
      const patients = await patientService.getAll(tok);
      if (patients.length > 0) {
        const trts = await treatmentService.getByPatient(patients[0].id, tok);
        if (trts.length > 0) {
          const tr = trts.find(x => x.isActive) || trts[0]; setT(tr);
          try { const isos = await isotopeService.getAll(); const i = isos.find(x => x.id === tr.isotopeId); if (i) setIso(i); } catch {}
        }
      }
    } catch {} finally { setLoading(false); }
  })(); }, []);

  if (loading) return <View style={[s.c, { backgroundColor: colors.background, justifyContent:'center', alignItems:'center' }]}><ActivityIndicator color={colors.primary} /></View>;
  if (!t) return <View style={[s.c, { backgroundColor: colors.background, justifyContent:'center', alignItems:'center' }]}><Text style={{ color: colors.textSecondary }}>Sin tratamiento activo</Text></View>;

  const r = calc(t.startDate, t.isolationDays);
  if (!r) return null;

  return (
    <ScrollView style={[s.c, { backgroundColor: colors.background }]} contentContainerStyle={s.content}>
      <View style={[s.banner, { backgroundColor: (t.isActive ? colors.success : colors.textSecondary) + '18' }]}>
        <StatusDot status={t.isActive ? 'active' : 'inactive'} size={10} />
        <Text style={[s.bannerText, { color: t.isActive ? colors.success : colors.textSecondary }]}>{t.isActive ? 'Tratamiento Activo' : 'Completado'}</Text>
        <Badge label={`Día ${r.elapsed + 1}`} variant="primary" />
      </View>
      <Card style={s.section}>
        <View style={s.sectionH}><ShieldIcon color={colors.primary} size={20} /><Text style={[s.sectionT, { color: colors.text }]}>Radioisótopo</Text></View>
        <View style={s.isoRow}><Text style={[s.isoSym, { color: colors.primary }]}>{iso?.symbol ?? t.isotopeName ?? '?'}</Text>
          <View><Text style={[s.isoName, { color: colors.text }]}>{iso?.name ?? t.isotopeName ?? 'N/A'}</Text><Text style={[s.isoDet, { color: colors.textSecondary }]}>Vida media: {iso?.halfLife ?? '?'} {iso?.halfLifeUnit ?? 'días'}</Text></View></View>
      </Card>
      <Card style={s.section}><Text style={[s.label, { color: colors.textSecondary }]}>DOSIS</Text>
        <View style={s.row}><View style={s.col}><Text style={[s.subl, { color: colors.textSecondary }]}>Dosis Inicial</Text><Text style={[s.subv, { color: colors.text }]}>{t.initialDose} mCi</Text></View><View style={s.div} /><View style={s.col}><Text style={[s.subl, { color: colors.textSecondary }]}>Umbral</Text><Text style={[s.subv, { color: colors.text }]}>{t.safetyThreshold} mSv</Text></View></View></Card>
      <Card style={s.section}><View style={s.sectionH}><ClockIcon color={colors.primary} size={20} /><Text style={[s.sectionT, { color: colors.text }]}>Aislamiento</Text></View>
        <View style={s.row}><View style={s.col}><Text style={[s.subl, { color: colors.textSecondary }]}>Total</Text><Text style={[s.subv, { color: colors.text }]}>{t.isolationDays} días</Text></View><View style={s.div} /><View style={s.col}><Text style={[s.subl, { color: colors.textSecondary }]}>Restante</Text><Text style={[s.subv, { color: colors.primary }]}>{r.days}d {r.hours}h</Text></View></View></Card>
      <Card style={s.section}><Text style={[s.label, { color: colors.textSecondary }]}>INFO</Text>
        <IR label="Habitación" value={`Sala ${t.room}`} colors={colors} />
        <IR label="Inicio" value={new Date(t.startDate).toLocaleDateString('es-ES')} colors={colors} />
        {typeof t.endDate === 'string' && <IR label="Fin" value={new Date(t.endDate).toLocaleDateString('es-ES')} colors={colors} last />}
      </Card>
    </ScrollView>
  );
}

function IR({ label, value, colors, last }: any) { return <View style={[ir.row, !last && ir.bb, !last && { borderBottomColor: colors.border }]}><Text style={[ir.l, { color: colors.textSecondary }]}>{label}</Text><Text style={[ir.v, { color: colors.text }]}>{value}</Text></View>; }

const s = StyleSheet.create({ c:{flex:1}, content:{padding:24,paddingBottom:40}, banner:{flexDirection:'row',alignItems:'center',padding:16,borderRadius:14,gap:10,marginBottom:20}, bannerText:{fontSize:16,fontWeight:'600',flex:1}, section:{padding:20,marginBottom:16}, sectionH:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:16}, sectionT:{fontSize:16,fontWeight:'600'}, isoRow:{flexDirection:'row',alignItems:'center',gap:16,paddingVertical:4}, isoSym:{fontSize:42,fontWeight:'800'}, isoName:{fontSize:18,fontWeight:'700',marginBottom:4}, isoDet:{fontSize:14}, label:{fontSize:12,fontWeight:'600',textTransform:'uppercase',letterSpacing:1,marginBottom:16}, row:{flexDirection:'row',alignItems:'flex-start'}, col:{flex:1,gap:4}, div:{width:1,height:32,backgroundColor:'rgba(0,0,0,0.1)',marginHorizontal:16}, subl:{fontSize:13}, subv:{fontSize:18,fontWeight:'700'} });
const ir = StyleSheet.create({ row:{flexDirection:'row',justifyContent:'space-between',paddingVertical:14}, bb:{borderBottomWidth:1}, l:{fontSize:14}, v:{fontSize:14,fontWeight:'600'} });
