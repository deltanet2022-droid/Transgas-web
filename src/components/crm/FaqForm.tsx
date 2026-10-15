import type { Faq } from '@prisma/client';
import { ActionForm } from '@/components/crm/ActionForm';
import { TagInput } from '@/components/crm/TagInput';
import { VariantsEditor } from '@/components/crm/VariantsEditor';
import { Field } from '@/components/crm/ui';
import { saveFaq } from '@/app/crm/(panel)/faq/actions';

/** prefill: frase sin respuesta (desde Métricas del chatbot) que se carga como pregunta y palabra clave. */
export function FaqForm({ faq, categories, prefill }: { faq?: Faq; categories: string[]; prefill?: string }) {
  return (
    <ActionForm action={saveFaq} submitLabel={faq ? 'Guardar cambios' : 'Crear pregunta'}>
      {faq && <input type="hidden" name="id" value={faq.id} />}
      <div className="row">
        <Field label="Pregunta" htmlFor="question" help="Es el nombre interno de la FAQ; no se muestra en el chat.">
          <input id="question" name="question" type="text" required maxLength={200} defaultValue={faq?.question ?? (prefill ? '¿' + prefill.replace(/[?¿]/g, '').trim() + '?' : undefined)} />
        </Field>
        <Field label="Categoría" htmlFor="category" help="Elegí una existente o escribí una nueva. «Emergencias» y «Seguridad» se muestran junto al 0800 en urgencias.">
          <input id="category" name="category" type="text" required maxLength={60} list="faq-categories" defaultValue={faq?.category} />
          <datalist id="faq-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field label="Palabras clave" help="Escribí como escribiría una persona y apretá Enter (o pegá una lista separada por comas). Se ignoran tildes, mayúsculas, plurales y sinónimos simples. Las frases («olor a gas», «cuánto tarda el alta») pesan más que las palabras sueltas.">
        <TagInput name="palabrasClave" initial={faq?.palabrasClave ?? (prefill ? [prefill.replace(/[?¿!¡]/g, '').trim()] : [])} />
      </Field>

      <Field label="Variantes de respuesta" help="Cargá 2 o 3 redacciones distintas de la misma respuesta: el chatbot elige una al azar para no repetir siempre lo mismo. Podés incluir enlaces del sitio como /tarifas.">
        <VariantsEditor name="respuestas" initial={faq?.respuestas ?? []} />
      </Field>

      <Field label="Botones de seguimiento (guían la charla)" help="Aparecen como botones después de la respuesta, para llevar al usuario al siguiente tema. Cada texto tiene que activar OTRA pregunta (por ejemplo «¿Cuánto tarda el alta?»); si no coincide con ninguna, el chatbot repregunta. Máximo 9.">
        <TagInput name="followUps" initial={faq?.followUps ?? []} placeholder="Escribí el texto del botón y apretá Enter" />
      </Field>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.86rem' }}>
        <input type="checkbox" name="active" defaultChecked={faq?.active ?? true} /> Activa (el chatbot puede usarla)
      </label>
    </ActionForm>
  );
}
