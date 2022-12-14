import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { SearchFormContainer } from './styles'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'
import { memo } from 'react'

/**
 * Por que um componente renderiza?
 * - Hooks Changed (mudou o estado, contexto, reducer)
 * - Props (mudou as propriedades)
 * - Parents rerendered (componente pai renderizou)
 *
 * Fluxo de renderização do React
 * 1. Recria HTML da interface do componente
 * 2. Compara o HTML recriado com a versão anterior
 * 3. Se mudou alguma coisa, ele reescreve o HTML recriado na tela
 *
 * Memo: (O uso deve ser somente caso tenha um HTML muito extenso)
 * Adciona um passo anterior ao passo 1 do fluxo de renderização
 * 0. Hooks changed, props changed (deep comparison)
 * 0.1. Comparar a versão anterior dos hooks e props
 * 0.2. SE mudou algo, ele segue o fluxo de renderização
 */

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormInputs = z.infer<typeof searchFormSchema>

function SearchFormComponent() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions
    },
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  })

  async function handleSearchTransactions(data: SearchFormInputs) {
    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register('query')}
      />
      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
}

export const SearchForm = memo(SearchFormComponent)
